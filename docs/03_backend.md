# Detalles del Backend

El backend de Lumen está construido con FastAPI y Python. Su principal responsabilidad es orquestar toda la lógica de IA y servir los resultados al frontend de manera eficiente.

## Endpoints de la API

La API expone dos endpoints principales definidos en `api.py`:

- `POST /session`:

  - **Propósito:** Iniciar una nueva sesión de conversación.
  - **Respuesta:** Un JSON con un `session_id` único que el frontend debe usar en todas las peticiones posteriores.
  - **Lógica:** Crea una nueva entrada en la tabla `sessions` de la base de datos.

- `POST /interact`:
  - **Propósito:** Procesar una interacción completa del usuario.
  - **Payload (Request):** Requiere un JSON con el audio del usuario, el contexto emocional facial, el historial y la memoria.
  - **Respuesta:** Devuelve un JSON con la respuesta de la IA en formato de texto y audio, junto con el historial y la memoria actualizados.
  - **Lógica:** Este es el endpoint principal que ejecuta el [flujo de datos completo](./02_flujo_de_datos.md).

## Análisis de Emoción Vocal

- **Modelo:** Se utiliza `superb/wav2vec2-base-superb-er`, un modelo pre-entrenado de Hugging Face especializado en reconocimiento de emociones.
- **Optimización con ONNX:** Para mejorar drásticamente el rendimiento de la inferencia, el modelo de PyTorch se convierte a formato ONNX (Open Neural Network Exchange).
  - El script `scripts/export_to_onnx.py` se encarga de esta conversión.
  - Genera varias versiones, incluyendo una de 32-bit (`float32`) y versiones cuantizadas (más pequeñas y rápidas, pero potencialmente menos precisas).
  - La aplicación utiliza `onnxruntime` para ejecutar estos modelos de manera muy eficiente en la CPU.
- **Preprocesamiento:** El audio recibido del frontend se normaliza (mono, 16kHz) usando la librería `pydub` para que coincida con lo que el modelo espera.

## Construcción de Prompts Empáticos

La calidad de la respuesta de la IA depende en gran medida de la calidad del prompt. El `prompt_builder.py` tiene la lógica para construir un prompt muy detallado que guía al LLM para que actúe de manera empática.

- **Estructura XML:** Se utilizan etiquetas tipo XML (`<Persona>`, `<Contexto_Emocional_Detectado>`) para delimitar claramente las diferentes partes del prompt.
- **Contexto Dinámico:** El prompt incluye dinámicamente la información emocional (facial y vocal) y los datos de la memoria a largo plazo, permitiendo a la IA contextualizar su respuesta.
- **Instrucción de Reflexión Interna:** Se le pide explícitamente al modelo que realice una "reflexión interna" antes de generar la respuesta final. Esto lo fuerza a considerar el estado emocional del usuario y a alinear su respuesta con los objetivos de la conversación (validar, explorar, etc.).

## Seguridad

La privacidad del usuario es una prioridad.

- **Cifrado en Reposo (At-Rest):** Toda la información sensible (contenido de los mensajes y hechos de memoria) se cifra usando un algoritmo **AES en modo GCM** antes de ser escrita en la base de datos SQLite.
- **Gestión de Claves:** La clave de cifrado es generada localmente y gestionada a través de variables de entorno (`.env`), asegurando que no se exponga en el código fuente. La lógica está centralizada en `src/database/data_manager.py`.
