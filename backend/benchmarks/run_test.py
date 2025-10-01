# backend/benchmarks/run_test.py

import requests
import os
import base64
import json
import numpy as np

# --- CONFIGURACIÓN ---
API_URL = "http://localhost:8000/interact"
AUDIO_FOLDER = "audio_samples"
NUM_RUNS_PER_FILE = 3 # número de veces que se probará cada archivo de audio

def run_performance_test():
    print("--- INICIANDO PRUEBA DE RENDIMIENTO DEL BACKEND DE LUMEN ---")
    
    audio_files = [f for f in os.listdir(AUDIO_FOLDER) if f.endswith(('.wav', '.mp3'))]
    if not audio_files:
        print(f"ERROR: No se encontraron archivos de audio en la carpeta '{AUDIO_FOLDER}'.")
        return

    print(f"Se encontraron {len(audio_files)} archivos de audio para la prueba.")
    
    total_durations = []

    for audio_file in audio_files:
        file_path = os.path.join(AUDIO_FOLDER, audio_file)
        print(f"\nProbando archivo: {audio_file} ({NUM_RUNS_PER_FILE} veces)...")
        
        with open(file_path, "rb") as f:
            audio_bytes = f.read()
        
        audio_b64 = base64.b64encode(audio_bytes).decode('utf-8')

        # preparamos un payload de solicitud falso, similar al que enviaría el frontend
        payload = {
            "session_id": 1,
            "audio_b64": audio_b64,
            "facial_emotion": {"stable_dominant_emotion": "neutral", "average_scores": {}},
            "chat_history": [],
            "long_term_memory": {}
        }
        
        for i in range(NUM_RUNS_PER_FILE):
            try:
                response = requests.post(API_URL, json=payload, timeout=20) # timeout de 20 segundos
                response.raise_for_status() # lanza un error si la respuesta es 4xx o 5xx
                
                data = response.json()
                duration = data.get("profiling_data", {}).get("total_interaction_duration_s")
                
                if duration:
                    print(f"  Run {i+1}: OK - Duración total: {duration:.4f} segundos.")
                    total_durations.append(duration)
                else:
                    print(f"  Run {i+1}: ERROR - La respuesta no incluyó datos de profiling.")

            except requests.exceptions.RequestException as e:
                print(f"  Run {i+1}: FALLÓ - Error en la solicitud a la API: {e}")

    if not total_durations:
        print("\nNo se pudo recolectar ningún dato de rendimiento.")
        return

    # --- CÁLCULO DE RESULTADOS FINALES ---
    promedio = np.mean(total_durations)
    desviacion_estandar = np.std(total_durations)
    
    print("\n\n--- RESULTADOS FINALES DE LA PRUEBA DE RENDIMIENTO ---")
    print(f"Número total de ejecuciones exitosas: {len(total_durations)}")
    print(f"Tiempo de respuesta promedio: {promedio:.4f} segundos")
    print(f"Desviación estándar (σ): {desviacion_estandar:.4f} segundos")
    print("-" * 50)


if __name__ == "__main__":
    # asegurarse de que el script se ejecute desde la carpeta correcta
    if not os.path.exists(AUDIO_FOLDER):
        print(f"ERROR: La carpeta '{AUDIO_FOLDER}' no existe.")
        print("Asegúrate de ejecutar este script desde la carpeta 'performance_tests'.")
    else:
        run_performance_test()