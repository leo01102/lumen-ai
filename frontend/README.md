# Lumen Frontend: Guía de Inicio Rápido

Este documento proporciona las instrucciones para instalar y ejecutar la interfaz de usuario de Lumen. Para obtener información detallada sobre su funcionamiento interno, consulta la [documentación principal del proyecto](../docs/04_frontend.md).

---

## 1. Prerrequisitos

- **Node.js** (versión 18.x o superior).
- **npm**, **yarn**, o **pnpm**.
- El **servidor del backend de Lumen debe estar en ejecución**.

## 2. Instalación

```bash
# Navega a esta carpeta (frontend) desde la raíz del proyecto
cd frontend

# Instala las dependencias
npm install
# o: yarn install / pnpm install
```

## 3. Configuración

1.  **Crear archivo `.env.local`**: En esta carpeta (`frontend/`), crea un archivo llamado `.env.local`.

2.  **Añadir URL de la API**: Especifica la dirección donde se está ejecutando el backend. Por defecto, es el puerto 8000.
    ```env
    # frontend/.env.local
    NEXT_PUBLIC_API_URL=http://localhost:8000
    ```

## 4. Ejecución

Con la configuración lista y el backend en marcha, inicia el servidor de desarrollo del frontend:

```bash
npm run dev
```

Abre tu navegador y visita **`http://localhost:3000`** para usar la aplicación.
