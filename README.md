# Lumen: Un Asistente con IA Emocional Multimodal

[![Estado del Proyecto](https://img.shields.io/badge/estado-en%20desarrollo-green.svg)](https://github.com/leo01102/Lumen)
[![Licencia](https://img.shields.io/badge/licencia-MIT-blue.svg)](LICENSE)

**Lumen es un asistente de IA conversacional full-stack que ofrece apoyo empático a través de una interfaz de voz, enriqueciendo la interacción con análisis emocional de rostro y tono de voz en tiempo real.**

Este repositorio contiene una aplicación moderna y desacoplada, compuesta por un backend de **FastAPI** que maneja la IA y un frontend de **Next.js** que ofrece una experiencia de usuario inmersiva.

<br>

<!-- ![GIF de la aplicación en funcionamiento](docs/images/demo.gif) -->

_(Reemplazar con una captura de pantalla o GIF de la nueva demo)_

---

## 🚀 Cómo Empezar

Para poner en marcha el proyecto, necesitas configurar y ejecutar tanto el backend como el frontend por separado.

- **Paso 1: Configurar el Backend**

  > El backend es responsable de todo el procesamiento de IA, la gestión de la base de datos y la comunicación con APIs externas.
  >
  > ➡️ **[Instrucciones de configuración del Backend](./backend/README.md)**

- **Paso 2: Configurar el Frontend**
  > El frontend proporciona la interfaz de usuario, captura el audio y video, y se comunica con el backend.
  >
  > ➡️ **[Instrucciones de configuración del Frontend](./frontend/README.md)**

---

## 📚 Documentación Detallada

Para comprender a fondo el funcionamiento interno del proyecto, la arquitectura y las decisiones de diseño, consulta la documentación centralizada:

- **[Arquitectura y Stack Tecnológico (`docs/01_arquitectura_y_stack.md`)](./docs/01_arquitectura_y_stack.md)**

  > Una visión general de la arquitectura cliente-servidor y las tecnologías utilizadas en el frontend y el backend.

- **[Flujo de Datos de una Interacción (`docs/02_flujo_de_datos.md`)](./docs/02_flujo_de_datos.md)**

  > Un desglose paso a paso de lo que ocurre cuando un usuario habla con Lumen.

- **[Detalles del Backend (`docs/03_backend.md`)](./docs/03_backend.md)**

  > Información sobre la API, el procesamiento de audio, la lógica de IA y la seguridad.

- **[Detalles del Frontend (`docs/04_frontend.md`)](./docs/04_frontend.md)**

  > Información sobre el análisis facial en el cliente, la gestión de estado y la estructura de componentes.

- **[Esquema de la Base de Datos (`docs/05_base_de_datos.md`)](./docs/05_base_de_datos.md)**
  > Descripción detallada de las tablas, columnas y el sistema de cifrado.

---

## ✨ Características Principales

- **Arquitectura Full-Stack:** Backend de FastAPI y frontend moderno de Next.js.
- **Análisis Emocional Multimodal:** Detección facial en el cliente (`face-api.js`) y reconocimiento vocal en el servidor (`Wav2Vec 2.0`).
- **Interacción por Voz Completa:** Transcripción con Deepgram y síntesis de voz con Edge-TTS.
- **IA Conversacional Avanzada:** Respuestas empáticas generadas por Llama 3.1 vía Groq.
- **Memoria Persistente y Cifrada:** Base de datos SQLite local con cifrado AES.
- **Interfaz de Usuario Responsiva:** Se adapta a escritorio y móvil para una experiencia consistente.
