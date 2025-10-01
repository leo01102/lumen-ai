# backend/src/utils/logger_config.py

import logging
import os
import warnings
from logging.handlers import RotatingFileHandler

def setup_logging():
    """
    Configura el sistema de logging para la aplicación.
    - Un handler para la consola con nivel INFO.
    - Un handler para un archivo rotativo con nivel DEBUG.
    - Silencia los logs demasiado "ruidosos" de librerías de terceros.
    """
    # --- CONFIGURACIÓN DE WARNINGS ---
    # ignorar warnings de keras/tf que son muy ruidosos
    warnings.filterwarnings("ignore", category=UserWarning, module='keras')
    warnings.filterwarnings("ignore", message="The name tf.reset_default_graph is deprecated")

    # --- CONFIGURACIÓN DE LOGGING ---
    # crear directorio de logs si no existe
    log_dir = "logs"
    if not os.path.exists(log_dir):
        os.makedirs(log_dir)

    # crear el logger principal
    # __name__ asegura que los loggers de los módulos hereden esta config
    logger = logging.getLogger()
    logger.setLevel(logging.DEBUG)  # capturar todo desde el nivel DEBUG hacia arriba

    # evitar duplicación de handlers si la función se llama varias veces
    if logger.hasHandlers():
        logger.handlers.clear()

    # crear el formato para los logs
    log_format = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )

    # handler para la consola (streamhandler)
    # muestra logs de nivel INFO y superior en la consola
    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.INFO)
    console_handler.setFormatter(log_format)

    # handler para el archivo (rotatingfilehandler)
    # guarda logs desde nivel DEBUG en un archivo rotativo (1mb)
    # mantiene hasta 3 backups
    log_file_path = os.path.join(log_dir, "lumenai.log")
    file_handler = RotatingFileHandler(
        log_file_path, maxBytes=1024*1024, backupCount=3
    )
    file_handler.setLevel(logging.DEBUG)
    file_handler.setFormatter(log_format)

    # añadir los handlers al logger
    logger.addHandler(console_handler)
    logger.addHandler(file_handler)

    # silenciar logs de librerías muy verbosas
    # esto no afecta a los warnings o errors
    logging.getLogger("httpx").setLevel(logging.WARNING)
    logging.getLogger("streamlit_webrtc").setLevel(logging.WARNING)
    logging.getLogger("aioice").setLevel(logging.WARNING)
    # dejar que libav/aiortc muestren warnings para estar al tanto
    # pero sin el ruido de info/debug
    logging.getLogger("libav").setLevel(logging.WARNING)
    logging.getLogger("aiortc").setLevel(logging.WARNING)