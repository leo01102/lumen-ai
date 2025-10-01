# Lumen Backend: Guía de Inicio Rápido

[![Python Version](https://img.shields.io/badge/python-3.9%2B-blue.svg)](https://www.python.org/downloads/)
[![Framework](https://img.shields.io/badge/framework-FastAPI-green.svg)](https://fastapi.tiangolo.com/)

Este documento proporciona las instrucciones para instalar y ejecutar el servidor de backend de Lumen. Para obtener información detallada sobre su funcionamiento interno, consulta la [documentación principal del proyecto](../docs/03_backend.md).

---

## 1. Prerrequisitos

- **Python 3.9–3.12** (probado con 3.11.9).
- **Git** para clonar el repositorio.
- **Cuentas de API:**
  - [Groq API Key](https://console.groq.com/keys)
  - [Deepgram API Key](https://console.deepgram.com/signup)

## 2. Instalación

```bash
# Navega a esta carpeta (backend) desde la raíz del proyecto
cd backend

# Crea y activa un entorno virtual (recomendado)
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate

# Instala las dependencias
pip install -r requirements.txt
```

## 3. Configuración

1.  **Crear archivo `.env`**: En esta carpeta (`backend/`), crea un archivo llamado `.env`.

2.  **Generar Clave de Cifrado**: Ejecuta el siguiente script para generar una clave segura.

    ```bash
    python scripts/generate_key.py
    ```

    Copia la línea `ENCRYPTION_KEY=...` que se imprime en la terminal.

3.  **Añadir Claves al `.env`**: Pega la clave de cifrado y añade tus claves de API al archivo `.env`. Debe tener el siguiente formato:
    ```env
    # backend/.env
    DEEPGRAM_API_KEY="TU_API_KEY_DE_DEEPGRAM"
    GROQ_API_KEY="TU_API_KEY_DE_GROQ"
    ENCRYPTION_KEY="TU_CLAVE_GENERADA_EN_EL_PASO_ANTERIOR"
    ```

## 4. Generación de Modelos Locales

El modelo de análisis de emoción vocal debe ser generado localmente una vez.

```bash
# Este script descarga el modelo de Hugging Face y lo convierte a formato ONNX
python scripts/export_to_onnx.py
```

_Nota: El script te preguntará si deseas realizar la "cuantización estática". Este paso es opcional, consume mucha RAM y puedes omitirlo de forma segura (`n`)._

## 5. Ejecución

Una vez completada la configuración, inicia el servidor de la API:

```bash
uvicorn api:app --reload --port 8000
```

La API estará disponible en `http://localhost:8000`. La documentación interactiva (Swagger UI) se encuentra en `http://localhost:8000/docs`.
