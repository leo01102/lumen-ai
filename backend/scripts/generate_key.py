# backend/scripts/generate_key.py | genera la clave de cifrado para el .env

from cryptography.fernet import Fernet

# generar una nueva clave segura
key = Fernet.generate_key()

# la clave es en bytes, la pasamos a string para el .env
key_str = key.decode()

print("Nueva clave de cifrado generada.")
print("Copia la siguiente línea y pégala en tu archivo .env:")
print("-" * 50)
print(f"ENCRYPTION_KEY={key_str}")
print("-" * 50)