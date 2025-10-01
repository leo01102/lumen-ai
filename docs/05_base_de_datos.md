# Esquema de la Base de Datos

Se utiliza una base de datos **SQLite** local para la persistencia de los datos. El diseño está normalizado en tres tablas principales para mantener los datos organizados y eficientes.

La lógica de gestión de la base de datos, incluyendo la creación del esquema y las operaciones CRUD (Crear, Leer, Actualizar, Borrar), se encuentra en `backend/src/database/data_manager.py`.

---

### Estructura Detallada

#### Tabla 1: `sessions`

Almacena metadatos de alto nivel sobre cada sesión de uso.

| Nombre de la Columna | Tipo de Dato (SQLite)               | Descripción                                             |
| :------------------- | :---------------------------------- | :------------------------------------------------------ |
| **session_id**       | `INTEGER PRIMARY KEY AUTOINCREMENT` | Identificador único para la sesión.                     |
| **start_time**       | `TEXT`                              | Fecha y hora de inicio de la sesión (formato ISO 8601). |
| **end_time**         | `TEXT`                              | Fecha y hora de finalización (NULL si está activa).     |
| **model_used**       | `TEXT`                              | Nombre del modelo de IA utilizado.                      |
| **settings_json**    | `TEXT`                              | Configuraciones de la sesión en formato JSON.           |

#### Tabla 2: `interactions`

Almacena cada mensaje intercambiado durante una sesión.

| Nombre de la Columna           | Tipo de Dato (SQLite)               | Descripción                                                                         |
| :----------------------------- | :---------------------------------- | :---------------------------------------------------------------------------------- |
| **interaction_id**             | `INTEGER PRIMARY KEY AUTOINCREMENT` | Identificador único para la interacción.                                            |
| **session_id**                 | `INTEGER`                           | Clave foránea que la vincula a la tabla `sessions`.                                 |
| **timestamp**                  | `TEXT`                              | Fecha y hora exacta de la interacción.                                              |
| **role**                       | `TEXT`                              | Autor del mensaje: `'user'` o `'assistant'`.                                        |
| **text_content**               | `TEXT`                              | **(Cifrado)** Transcripción o respuesta de la IA.                                   |
| **facial_emotion_dominant**    | `TEXT`                              | Emoción facial dominante estable detectada (enviada desde el cliente).              |
| **facial_emotion_scores_json** | `TEXT`                              | Desglose de puntuaciones de emoción promedio en formato JSON (enviado del cliente). |
| **vocal_analysis_json**        | `TEXT`                              | Resultados del análisis de emoción vocal (lista de emociones y scores) en JSON.     |

#### Tabla 3: `user_memory`

Almacena hechos clave sobre el usuario para la memoria a largo plazo.

| Nombre de la Columna | Tipo de Dato (SQLite) | Descripción                                            |
| :------------------- | :-------------------- | :----------------------------------------------------- |
| **key**              | `TEXT PRIMARY KEY`    | La clave del hecho (ej. 'nombre', 'tema_recurrente').  |
| **value**            | `TEXT`                | **(Cifrado)** El valor del hecho extraído por la IA.   |
| **last_updated**     | `TEXT`                | Fecha y hora de la última actualización de este hecho. |

---

### Relación entre Tablas

Una `session` puede tener muchas `interactions`. La tabla `user_memory` es independiente, actuando como un perfil de usuario persistente a través de todas las sesiones.

```
+--------------+          +--------------------+
|   sessions   |          |    interactions    |
+--------------+          +--------------------+
| session_id   |---------<| session_id         |
| start_time   |          | interaction_id     |
| ...          |          | ...                |
+--------------+          +--------------------+

+----------------+
|  user_memory   |
+----------------+
| key            |
| value          |
+----------------+
```

---

### Seguridad y Cifrado

Para proteger la privacidad del usuario, los campos de texto sensibles se cifran antes de ser guardados en la base de datos.

- **Campos Cifrados:** `interactions.text_content` y `user_memory.value`.
- **Algoritmo:** Se utiliza un cifrado simétrico robusto **(AES con modo GCM)** a través de la librería `cryptography` de Python.
- **Gestión de la Clave:** La clave de cifrado (`ENCRYPTION_KEY`) se genera localmente usando `scripts/generate_key.py` y se almacena en el archivo `.env` del backend. **Es crucial no subir este archivo a repositorios públicos.** La lógica de cifrado y descifrado está centralizada en el módulo `src/database/data_manager.py`.
