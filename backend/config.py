# backend/config.py | centraliza la configuración desde variables de entorno

import os
from dotenv import load_dotenv

load_dotenv()

# claves de api
DEEPGRAM_API_KEY = os.getenv("DEEPGRAM_API_KEY")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# clave de cifrado
ENCRYPTION_KEY = os.getenv("ENCRYPTION_KEY")

if not all([DEEPGRAM_API_KEY, GROQ_API_KEY, ENCRYPTION_KEY]):
    raise ValueError("Faltan una o más variables de entorno. Asegúrate de que DEEPGRAM_API_KEY, GROQ_API_KEY, y ENCRYPTION_KEY están definidas en tu archivo .env.")

# otras configuraciones
EDGE_VOICE = "es-CO-SalomeNeural"