# backend/tests/unit/test_database.py

import sys
import os
from pathlib import Path
import pytest
import sqlite3
from cryptography.fernet import Fernet
# ya no necesitamos 'patch' porque podemos pasar la conexión directamente
# from unittest.mock import patch

# añadir el directorio raíz del backend a la ruta del sistema
BACKEND_ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(BACKEND_ROOT))

from src.database.data_manager import setup_database, save_interaction_encrypted, CipherManager

# --- FIXTURES DE PYTEST ---

@pytest.fixture(scope="function")
def db_connection():
    """
    Crea y configura una base de datos en memoria para cada función de prueba
    El scope 'function' asegura que cada test se ejecute en un entorno limpio
    """
    conn = sqlite3.connect(":memory:")
    setup_database(conn)
    yield conn
    conn.close()

@pytest.fixture
def test_cipher():
    """
    Proporciona una instancia de CipherManager con una clave de cifrado de prueba
    """
    key = Fernet.generate_key().decode()
    return CipherManager(key)

# --- PRUEBAS UNITARIAS ---

def test_database_setup(db_connection):
    """
    Verifica que la función setup_database cree las tablas esperadas
    """
    cursor = db_connection.cursor()
    tables_to_check = ["sessions", "interactions", "user_memory"]
    
    for table in tables_to_check:
        cursor.execute(f"SELECT name FROM sqlite_master WHERE type='table' AND name='{table}';")
        assert cursor.fetchone() is not None, f"la tabla '{table}' no fue creada"
        print(f"  -> verificación de la tabla '{table}' correcta")

def test_save_and_read_encrypted_interaction(db_connection, test_cipher):
    """
    Prueba el flujo de guardar una interacción cifrada y verificar su descifrado
    """
    # sobreescribir el cipher global solo para esta prueba
    from src.database import data_manager
    data_manager.cipher = test_cipher

    session_id = 1
    role = 'user'
    original_text = "Este es un mensaje secreto de prueba"
    data = {
        "text": original_text,
        "facial_dominant": "happy"
    }
    
    # ahora podemos pasar la conexión de prueba directamente a la función
    save_interaction_encrypted(session_id, role, data, connection=db_connection)

    # la conexión ya no se cierra, por lo que esta parte funcionará
    cursor = db_connection.cursor()
    cursor.execute("SELECT text_content FROM interactions WHERE session_id=?", (session_id,))
    row = cursor.fetchone()
    
    assert row is not None
    encrypted_text = row[0]

    # verificar que el texto en la bd no es el texto plano original
    assert encrypted_text != original_text
    
    # verificar que se puede descifrar correctamente al original
    decrypted_text = test_cipher.decrypt(encrypted_text)
    assert decrypted_text == original_text
    print("  -> verificación de cifrado y descifrado correcta")