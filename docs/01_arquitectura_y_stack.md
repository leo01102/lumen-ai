# Arquitectura y Stack Tecnológico

Lumen está diseñado como una aplicación web moderna full-stack, con una clara separación entre el cliente (frontend) y el servidor (backend). Esta arquitectura desacoplada permite un desarrollo y escalado independientes de cada componente.

- El **Frontend (Next.js)** se encarga de toda la interacción con el usuario, la visualización, la captura de medios (audio/video) y el análisis facial en tiempo real.
- El **Backend (FastAPI)** actúa como el cerebro del sistema, manejando toda la lógica de IA, el procesamiento de datos pesados, la seguridad y la comunicación con servicios de terceros.

Ambos componentes se comunican a través de una API RESTful.

---

## Stack Tecnológico

A continuación se detallan las tecnologías clave utilizadas en cada parte del proyecto.

### Backend

| Rol                            | Herramienta / Librería         | Propósito                                                        |
| :----------------------------- | :----------------------------- | :--------------------------------------------------------------- |
| **Framework API**              | FastAPI                        | Creación de una API web asíncrona y de alto rendimiento.         |
| **Lenguaje**                   | Python                         | Lenguaje principal para toda la lógica de IA y del servidor.     |
| **IA Conversacional (LLM)**    | Groq API (Llama 3.1)           | Generación de respuestas de texto rápidas y de alta calidad.     |
| **Detección de Emoción Vocal** | Wav2Vec 2.0 (con ONNX Runtime) | Análisis del tono de voz para inferir emociones.                 |
| **Transcripción de Voz (STT)** | Deepgram API                   | Conversión de audio a texto con alta precisión.                  |
| **Síntesis de Voz (TTS)**      | Edge-TTS                       | Generación de audio natural a partir de texto.                   |
| **Base de Datos Local**        | SQLite                         | Almacenamiento persistente de sesiones, interacciones y memoria. |
| **Seguridad de Datos**         | `cryptography` (AES-GCM)       | Cifrado de datos sensibles del usuario antes de guardarlos.      |

### Frontend

| Rol                       | Herramienta / Librería  | Propósito                                                                     |
| :------------------------ | :---------------------- | :---------------------------------------------------------------------------- |
| **Framework Web**         | Next.js, React          | Construcción de una interfaz de usuario reactiva y optimizada para el SEO.    |
| **Lenguaje**              | TypeScript              | Añade tipado estático a JavaScript para un código más robusto y mantenible.   |
| **Detección Facial**      | `face-api.js`           | Análisis de expresiones faciales en tiempo real directamente en el navegador. |
| **Estilos y Componentes** | Tailwind CSS, shadcn/ui | Creación de una interfaz de usuario moderna, responsiva y personalizable.     |
| **Gestión de Audio**      | `MediaRecorder` API     | Grabación de audio desde el micrófono del usuario.                            |
| **Animaciones**           | Shaders, CSS            | Creación de visualizaciones dinámicas como el orbe de voz.                    |
