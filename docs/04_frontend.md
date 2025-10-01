# Detalles del Frontend

El frontend de Lumen está construido con Next.js y TypeScript, enfocado en ofrecer una experiencia de usuario fluida, responsiva y en tiempo real.

## Análisis Facial en el Cliente

Una de las decisiones clave de la arquitectura fue realizar el análisis de emociones faciales directamente en el navegador del cliente.

- **Librería:** Se utiliza `face-api.js`, una librería de JavaScript que implementa arquitecturas de redes neuronales convolucionales (CNNs) para la detección de rostros y el reconocimiento de expresiones, directamente sobre TensorFlow.js.
- **Ventajas:**
  1.  **Privacidad:** El stream de video de la cámara del usuario nunca abandona su dispositivo. Solo se envía al backend un resumen agregado de las emociones detectadas (ej. `{ "stable_dominant_emotion": "sad", "scores": {...} }`).
  2.  **Rendimiento en Tiempo Real:** Elimina la latencia de red que implicaría enviar un stream de video al servidor para su análisis. La retroalimentación en la interfaz (como en la vista de depuración) es instantánea.
  3.  **Ahorro de Costos de Servidor:** Reduce significativamente la carga computacional en el backend.
- **Implementación:**
  - El componente `FacialEmotionAnalysis.tsx` se encarga de cargar los modelos de `face-api.js`, gestionar el acceso a la cámara y ejecutar el análisis en un bucle (`setInterval`).
  - Para evitar resultados erráticos, implementa un "buffer" que promedia las últimas detecciones, proporcionando un estado emocional más estable.

## Gestión de Estado

- **Hook `useLumenChat`:** Toda la lógica de negocio del frontend está centralizada en el custom hook `src/features/voice-chat/hooks/use-lumen-chat.ts`.
- **Responsabilidades del Hook:**
  - Gestionar el ciclo de vida de la sesión con el backend.
  - Manejar el estado de la conversación (`messages`, `longTermMemory`).
  - Controlar los estados de la UI (`isProcessing`, `isAISpeaking`, `isUserSpeaking`).
  - Abstraer la lógica de grabación y parada del micrófono (`MediaRecorder`).
  - Encapsular la comunicación con la API a través de las funciones de `api-client.ts`.
- **Persistencia Local:** El hook utiliza `localStorage` para guardar y recuperar el `session_id`, el historial de mensajes y la memoria a largo plazo. Esto permite al usuario refrescar la página y continuar su conversación.

## Diseño Responsivo

La aplicación está diseñada para ser completamente funcional tanto en escritorio como en dispositivos móviles.

- **Detección del Dispositivo:** La página principal (`voice-chat/page.tsx`) detecta el tamaño de la pantalla y el agente de usuario para decidir qué layout renderizar.
- **Layouts Separados:**
  - `VoiceChatDesktopLayout.tsx`: Utiliza un diseño de paneles redimensionables (`shadcn/resizable`) para mostrar el chat y la vista principal uno al lado del otro.
  - `VoiceChatMobileLayout.tsx`: Utiliza un diseño vertical. El panel de chat se puede mostrar u ocultar en la parte superior de la pantalla para maximizar el espacio para la visualización del orbe.
- **Tailwind CSS:** Se utilizan clases de utilidad y variantes responsivas (ej. `md:flex`, `hidden`, `lg:block`) para adaptar los estilos a diferentes tamaños de pantalla.
