# backend/scripts/test_empathy_comparison.py

import sys
from pathlib import Path

# Añadir el directorio raíz al path para importar desde 'src'
REPO_ROOT = Path(__file__).resolve().parents[1]
sys.path.append(str(REPO_ROOT))

from src.chat.llm_client import get_groq_response
from src.chat.prompt_builder import build_llm_prompt

def run_comparison():
    print("--- INICIANDO COMPARACIÓN DE EMPATÍA ---")

    # --- 1. Definir el escenario de prueba ---
    user_text = "No sé qué hacer, acabo de recibir una mala noticia."
    chat_history = [] # Historial vacío para una prueba limpia
    long_term_memory = {} # Memoria vacía

    # Contexto emocional simulado
    emotional_context = {
        "facial_dominant": "sad",
        "vocal_emotions": [
            {'label': 'SADNESS', 'score': 0.75},
            {'label': 'FEAR', 'score': 0.15},
            {'label': 'NEUTRAL', 'score': 0.10}
        ]
    }

    # --- 2. Generar Prompt A (Simple, solo texto) ---
    print("\n[TEST 1] Generando respuesta con contexto simple (solo texto)...")
    prompt_simple = build_llm_prompt(
        chat_history + [{"role": "user", "content": user_text}],
        user_text,
        {}, # SIN CONTEXTO EMOCIONAL
        long_term_memory
    )
    response_simple = get_groq_response(prompt_simple)
    print(f"Respuesta Simple: {response_simple}")

    # --- 3. Generar Prompt B (Enriquecido, con contexto multimodal) ---
    print("\n[TEST 2] Generando respuesta con contexto enriquecido (multimodal)...")
    prompt_enriched = build_llm_prompt(
        chat_history + [{"role": "user", "content": user_text}],
        user_text,
        emotional_context, # CON CONTEXTO EMOCIONAL
        long_term_memory
    )
    response_enriched = get_groq_response(prompt_enriched)
    print(f"Respuesta Enriquecida: {response_enriched}")

    print("\n--- COMPARACIÓN FINALIZADA ---")

if __name__ == "__main__":
    run_comparison()