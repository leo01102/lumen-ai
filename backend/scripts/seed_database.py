# backend/scripts/seed_database.py

import sys
import os
from pathlib import Path
import sqlite3

# añadir el directorio raíz al path para poder importar desde src
REPO_ROOT = Path(__file__).resolve().parents[1]
sys.path.append(str(REPO_ROOT))

from src.database.data_manager import setup_database, save_interaction_encrypted, save_memory_fact, create_connection

def seed_data():
    """
    Puebla la base de datos con datos de prueba si está vacía.
    """
    print("Iniciando el proceso de siembra de la base de datos...")

    # asegurarse de que las tablas existen
    setup_database()
    
    conn = create_connection()
    if conn is None:
        print("No se pudo conectar a la base de datos. Abortando siembra.")
        return

    try:
        cursor = conn.cursor()

        # comprobar si ya hay datos
        cursor.execute("SELECT COUNT(*) FROM interactions")
        interaction_count = cursor.fetchone()[0]

        if interaction_count > 0:
            print("La base de datos ya contiene datos. No se necesita siembra.")
            return

        print("Base de datos vacía. Insertando datos de prueba...")
        
        # --- DATOS DE PRUEBA ---
        session_id = 1 # datos para una primera sesión de prueba
        
        # interacción 1
        user_interaction_1 = {
            "text": "Hola, últimamente me he sentido un poco abrumado con el trabajo.",
            "facial_dominant": "sad",
            "facial_scores": {"sad": 0.7, "neutral": 0.2, "angry": 0.1}
        }
        save_interaction_encrypted(session_id, 'user', user_interaction_1)

        assistant_interaction_1 = {"text": "Entiendo, sentirse abrumado por el trabajo es muy común. ¿Hay algo en particular que te esté pesando más?"}
        save_interaction_encrypted(session_id, 'assistant', assistant_interaction_1)
        
        # memoria de prueba
        save_memory_fact("tema_recurrente", "Estrés laboral")
        
        print("Datos de prueba insertados exitosamente.")

    except sqlite3.Error as e:
        print(f"Ocurrió un error de SQLite durante la siembra: {e}")
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    seed_data()