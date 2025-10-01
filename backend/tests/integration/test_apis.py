# backend/tests/integration/test_apis.py

import sys
import os
from pathlib import Path
import pytest
from unittest.mock import patch, AsyncMock

# --- Corrección de la ruta ---
# El script se encuentra en backend/tests/integration
# Para importar desde 'src', necesitamos añadir el directorio 'backend' al path
# Path(__file__).resolve() -> .../backend/tests/integration/test_apis.py
# .parents[2] -> .../backend
BACKEND_ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(BACKEND_ROOT))

# Ahora las importaciones desde 'src' deberían funcionar
from src.analysis.voice_transcription import transcribe_audio_deepgram
from src.chat.llm_client import get_groq_response
# --- Corrección del nombre de la función importada ---
from src.chat.prompt_builder import build_llm_prompt_from_chunks

# --- Configuración de la prueba ---
# Usamos una ruta relativa desde la raíz del 'backend' para mayor consistencia
AUDIO_FILE_PATH = BACKEND_ROOT / "tests" / "fixtures" / "short_spanish_test.wav"
TEST_USER_TEXT = "Hola, esta es una prueba para ver si la transcripción y el LLM funcionan."

# --- Pruebas principales con Pytest ---

@pytest.mark.asyncio
@patch('src.analysis.voice_transcription.dg_client', new_callable=AsyncMock)
async def test_deepgram_transcription_success(mock_dg_client):
    """
    Prueba que la transcripción de Deepgram funciona correctamente con una respuesta simulada.
    """
    print("\n[1] Probando la transcripción de Deepgram (Éxito)")

    mock_response = {
        "results": {"channels": [{"alternatives": [{"transcript": "hola esta es una prueba de voz"}]}]}
    }
    mock_dg_client.transcription.prerecorded.return_value = mock_response

    try:
        with open(AUDIO_FILE_PATH, "rb") as audio_file:
            audio_bytes = audio_file.read()
        
        user_text_from_audio = await transcribe_audio_deepgram(audio_bytes)
        
        assert user_text_from_audio == "hola esta es una prueba de voz"
        print(f"  -> Transcripción correcta: '{user_text_from_audio}'")

    except FileNotFoundError:
        pytest.fail(f"No se encontró el archivo de audio de prueba en: {AUDIO_FILE_PATH}")
    except Exception as e:
        pytest.fail(f"Falló la prueba de transcripción con una excepción inesperada: {e}")

@pytest.mark.asyncio
@patch('src.analysis.voice_transcription.dg_client', new_callable=AsyncMock)
async def test_deepgram_transcription_failure(mock_dg_client):
    """
    Prueba que la transcripción de Deepgram maneja correctamente los errores de la API.
    """
    print("\n[1] Probando la transcripción de Deepgram (Fallo)")
    mock_dg_client.transcription.prerecorded.side_effect = Exception("Error de API simulado")

    with open(AUDIO_FILE_PATH, "rb") as audio_file:
        audio_bytes = audio_file.read()
    
    result = await transcribe_audio_deepgram(audio_bytes)
    assert result is None
    print("  -> Manejo de errores de Deepgram verificado.")

@patch('src.chat.llm_client.groq_client')
def test_groq_llm_response_success(mock_groq_client):
    """
    Prueba que la respuesta del LLM de Groq se maneja correctamente con una respuesta simulada.
    """
    print("\n[2] Probando la respuesta del LLM de Groq (Éxito)")

    mock_choice = AsyncMock()
    mock_choice.message.content = "Respuesta de IA simulada."
    mock_groq_client.chat.completions.create.return_value.choices = [mock_choice]
    
    # --- Adaptación a la nueva firma de la función ---
    mock_memory = {"nombre": "Leo"}
    mock_analysis_chunks = [{'transcript': TEST_USER_TEXT}]
    
    # Usar la función correcta y la estructura de datos adecuada
    prompt_messages = build_llm_prompt_from_chunks(
        chat_history=[], 
        analysis_chunks=mock_analysis_chunks, 
        long_term_memory=mock_memory
    )
    
    ai_response = get_groq_response(prompt_messages)
    
    assert ai_response == "Respuesta de IA simulada."
    print(f"  -> Respuesta del LLM correcta: '{ai_response}'")

@patch('src.chat.llm_client.groq_client')
def test_groq_llm_response_failure(mock_groq_client):
    """
    Prueba que el cliente de Groq maneja correctamente los errores de la API.
    """
    print("\n[2] Probando la respuesta del LLM de Groq (Fallo)")

    mock_groq_client.chat.completions.create.side_effect = Exception("Error de API de Groq simulado")

    # Adaptar la llamada para que coincida con la firma de la función
    prompt_messages = build_llm_prompt_from_chunks(
        chat_history=[],
        analysis_chunks=[{'transcript': TEST_USER_TEXT}],
        long_term_memory={}
    )
    
    ai_response = get_groq_response(prompt_messages)
    
    assert "Lo siento, tuve un problema al generar una respuesta." in ai_response
    print("  -> Manejo de errores de Groq verificado.")