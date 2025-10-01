# backend/api.py

import logging
import base64
import time
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any

# --- CONFIGURACIÓN E INICIALIZACIÓN ---
from src.utils.logger_config import setup_logging
setup_logging()

from src.analysis.facial_emotion import initialize_detector
from src.analysis.voice_transcription import run_transcription
from src.analysis.voice_emotion import get_recognizer
from src.chat.llm_client import get_groq_response, extract_memory_from_text
from src.audio.tts_player import run_synthesis
from src.chat.prompt_builder import build_llm_prompt, build_memory_extraction_prompt
from src.database.data_manager import setup_database, start_new_session, save_interaction_encrypted, save_memory_fact, get_all_memory

# inicializar aplicación FastAPI
app = FastAPI(
    title="Lumen Backend API",
    version="1.0.0",
    description="API para el asistente emocional multimodal Lumen."
)

# --- MIDDLEWARE (CORS) ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- cargar de modelos (singleton en el estado de la app) ---
@app.on_event("startup")
def load_models_on_startup():
    logging.info("Cargando modelos de IA en memoria...")
    app.state.facial_detector = initialize_detector()
    app.state.vocal_recognizer = get_recognizer(method="onnx_fp32")
    setup_database()
    if app.state.facial_detector and app.state.vocal_recognizer:
        logging.info("Modelos y base de datos listos.")
    else:
        logging.error("Fallo crítico al cargar modelos, la API puede no funcionar correctamente")

# --- modelos de datos (pydantic) para validación ---
class EmotionPayload(BaseModel):
    stable_dominant_emotion: str | None = None
    average_scores: Dict[str, float] | None = None

class InteractionRequest(BaseModel):
    session_id: int
    audio_b64: str
    facial_emotion: EmotionPayload | None = None
    chat_history: List[Dict[str, str]]
    long_term_memory: Dict[str, Any]

class InteractionResponse(BaseModel):
    ai_text: str
    ai_audio_b64: str | None
    extracted_memory: Dict[str, Any]
    updated_chat_history: List[Dict[str, str]]
    vocal_analysis_result: List[Dict[str, Any]] | None
    profiling_data: Dict[str, float] | None = None

# --- endpoints ---

@app.get("/")
def read_root():
    return {"status": "Lumen Backend está funcionando."}

@app.post("/session", status_code=201)
def create_new_session():
    session_id = start_new_session()
    if session_id is None:
        raise HTTPException(status_code=500, detail="No se pudo crear la sesión en la base de datos.")
    logging.info(f"Nueva sesión creada con ID: {session_id}")
    return {"session_id": session_id}

@app.post("/interact", response_model=InteractionResponse)
def process_interaction(request: InteractionRequest, http_request: Request):
    # iniciar profiling
    profiling_data = {}
    start_total_time = time.perf_counter()

    logging.info(f"Procesando interacción para la sesión {request.session_id}...")
    
    vocal_recognizer = http_request.app.state.vocal_recognizer
    if not vocal_recognizer:
        raise HTTPException(status_code=503, detail="Servicio no disponible: los modelos de IA no están cargados.")

    try:
        audio_bytes = base64.b64decode(request.audio_b64)
    except Exception:
        raise HTTPException(status_code=400, detail="Error al decodificar el audio base64.")

    # 1 análiss en paralelo
    start_analysis_time = time.perf_counter()
    user_text = run_transcription(audio_bytes)
    profiling_data['transcription_duration_s'] = time.perf_counter() - start_analysis_time

    start_vocal_time = time.perf_counter()
    vocal_emotion_data = vocal_recognizer.predict(audio_bytes)
    profiling_data['vocal_analysis_duration_s'] = time.perf_counter() - start_vocal_time

    if not user_text or not user_text.strip():
        raise HTTPException(status_code=400, detail="La transcripción falló o el audio estaba vacío.")

    # 2 guardar interacción del usuario
    facial_emotion_data = request.facial_emotion.dict() if request.facial_emotion else {}
    user_interaction_data = {
        "text": user_text,
        "facial_dominant": facial_emotion_data.get("stable_dominant_emotion"),
        "facial_scores": facial_emotion_data.get("average_scores"),
        "vocal_analysis": vocal_emotion_data
    }
    save_interaction_encrypted(request.session_id, 'user', user_interaction_data)
    
    # 3 construir prompt y obtener respuesta del llm
    updated_chat_history = request.chat_history + [{"role": "user", "content": user_text}]
    prompt_messages = build_llm_prompt(updated_chat_history, user_text, {
        "facial_dominant": user_interaction_data["facial_dominant"],
        "vocal_emotions": vocal_emotion_data
    }, request.long_term_memory)

    start_llm_time = time.perf_counter()
    ai_response_text = get_groq_response(prompt_messages)
    profiling_data['llm_response_duration_s'] = time.perf_counter() - start_llm_time
    
    # 4 extraer y guardar memoria
    start_memory_time = time.perf_counter()
    memory_prompt = build_memory_extraction_prompt(user_text, ai_response_text)
    extracted_facts = extract_memory_from_text(memory_prompt)
    if extracted_facts:
        for key, value in extracted_facts.items():
            save_memory_fact(key, value)
    profiling_data['memory_extraction_duration_s'] = time.perf_counter() - start_memory_time
    
    # 5 guardar interacción de la ia
    save_interaction_encrypted(request.session_id, 'assistant', {"text": ai_response_text})
    
    # 6 sintetizar audio
    start_tts_time = time.perf_counter()
    ai_audio_bytes = run_synthesis(ai_response_text)
    profiling_data['tts_synthesis_duration_s'] = time.perf_counter() - start_tts_time

    ai_audio_b64 = base64.b64encode(ai_audio_bytes).decode('utf-8') if ai_audio_bytes else None
    
    # 7 devolver respuesta completa
    final_chat_history = updated_chat_history + [{"role": "assistant", "content": ai_response_text}]

    # fin del profiling
    profiling_data['total_interaction_duration_s'] = time.perf_counter() - start_total_time
    logging.info(f"profiling data for session {request.session_id}: {profiling_data}")
    
    return InteractionResponse(
        ai_text=ai_response_text,
        ai_audio_b64=ai_audio_b64,
        extracted_memory=extracted_facts,
        updated_chat_history=final_chat_history,
        vocal_analysis_result=vocal_emotion_data,
        profiling_data=profiling_data
    )