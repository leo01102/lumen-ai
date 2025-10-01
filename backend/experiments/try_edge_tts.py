# backend/experiments/try_edge_tts.py

import asyncio
import edge_tts
import os

# Texto que se convertirá a voz.
TEXT_TO_SPEAK = (
    "Hola, esta es una prueba de la biblioteca edge-tts. "
    "Estoy utilizando una voz neuronal para generar este audio. "
    "¿Qué te parece la calidad del sonido?"
)

# Voz específica que queremos usar para el ejemplo.
# Puedes cambiarla por cualquiera de la lista que se imprimirá.
# Ejemplo: 'es-MX-JorgeNeural' (México), 'es-ES-AlvaroNeural' (España)
VOICE = "es-ES-ArabellaMultilingualNeural"
""" --- Idioma: es ---
  - Nombre: es-AR-ElenaNeural, Género: Female
  - Nombre: es-AR-TomasNeural, Género: Male
  - Nombre: es-BO-SofiaNeural, Género: Female
  - Nombre: es-BO-MarceloNeural, Género: Male
  - Nombre: es-CL-CatalinaNeural, Género: Female
  - Nombre: es-CL-LorenzoNeural, Género: Male
  - Nombre: es-CO-SalomeNeural, Género: Female
  - Nombre: es-CO-GonzaloNeural, Género: Male
  - Nombre: es-CR-MariaNeural, Género: Female
  - Nombre: es-CR-JuanNeural, Género: Male
  - Nombre: es-CU-BelkysNeural, Género: Female
  - Nombre: es-CU-ManuelNeural, Género: Male
  - Nombre: es-DO-RamonaNeural, Género: Female
  - Nombre: es-DO-EmilioNeural, Género: Male
  - Nombre: es-EC-AndreaNeural, Género: Female
  - Nombre: es-EC-LuisNeural, Género: Male
  - Nombre: es-ES-ElviraNeural, Género: Female
  - Nombre: es-ES-AlvaroNeural, Género: Male
  - Nombre: es-ES-ArabellaMultilingualNeural, Género: Female
  - Nombre: es-ES-IsidoraMultilingualNeural, Género: Female
  - Nombre: es-ES-TristanMultilingualNeural, Género: Male
  - Nombre: es-ES-XimenaMultilingualNeural, Género: Female
  - Nombre: es-ES-AbrilNeural, Género: Female
  - Nombre: es-ES-ArnauNeural, Género: Male
  - Nombre: es-ES-DarioNeural, Género: Male
  - Nombre: es-ES-EliasNeural, Género: Male
  - Nombre: es-ES-EstrellaNeural, Género: Female
  - Nombre: es-ES-IreneNeural, Género: Female
  - Nombre: es-ES-LaiaNeural, Género: Female
  - Nombre: es-ES-LiaNeural, Género: Female
  - Nombre: es-ES-NilNeural, Género: Male
  - Nombre: es-ES-SaulNeural, Género: Male
  - Nombre: es-ES-TeoNeural, Género: Male
  - Nombre: es-ES-TrianaNeural, Género: Female
  - Nombre: es-ES-VeraNeural, Género: Female
  - Nombre: es-ES-XimenaNeural, Género: Female
  - Nombre: es-ES-Tristan:DragonHDLatestNeural, Género: Male
  - Nombre: es-ES-Ximena:DragonHDLatestNeural, Género: Female
  - Nombre: es-GQ-TeresaNeural, Género: Female
  - Nombre: es-GQ-JavierNeural, Género: Male
  - Nombre: es-GT-MartaNeural, Género: Female
  - Nombre: es-GT-AndresNeural, Género: Male
  - Nombre: es-HN-KarlaNeural, Género: Female
  - Nombre: es-HN-CarlosNeural, Género: Male
  - Nombre: es-MX-DaliaNeural, Género: Female
  - Nombre: es-MX-JorgeNeural, Género: Male
  - Nombre: es-MX-DaliaMultilingualNeural, Género: Female
  - Nombre: es-MX-JorgeMultilingualNeural, Género: Male
  - Nombre: es-MX-BeatrizNeural, Género: Female
  - Nombre: es-MX-CandelaNeural, Género: Female
  - Nombre: es-MX-CarlotaNeural, Género: Female
  - Nombre: es-MX-CecilioNeural, Género: Male
  - Nombre: es-MX-GerardoNeural, Género: Male
  - Nombre: es-MX-LarissaNeural, Género: Female
  - Nombre: es-MX-LibertoNeural, Género: Male
  - Nombre: es-MX-LucianoNeural, Género: Male
  - Nombre: es-MX-MarinaNeural, Género: Female
  - Nombre: es-MX-NuriaNeural, Género: Female
  - Nombre: es-MX-PelayoNeural, Género: Male
  - Nombre: es-MX-RenataNeural, Género: Female
  - Nombre: es-MX-YagoNeural, Género: Male
  - Nombre: es-NI-YolandaNeural, Género: Female
  - Nombre: es-NI-FedericoNeural, Género: Male
  - Nombre: es-PA-MargaritaNeural, Género: Female
  - Nombre: es-PA-RobertoNeural, Género: Male
  - Nombre: es-PE-CamilaNeural, Género: Female
  - Nombre: es-PE-AlexNeural, Género: Male
  - Nombre: es-PR-KarinaNeural, Género: Female
  - Nombre: es-PR-VictorNeural, Género: Male
  - Nombre: es-PY-TaniaNeural, Género: Female
  - Nombre: es-PY-MarioNeural, Género: Male
  - Nombre: es-SV-LorenaNeural, Género: Female
  - Nombre: es-SV-RodrigoNeural, Género: Male
  - Nombre: es-US-PalomaNeural, Género: Female
  - Nombre: es-US-AlonsoNeural, Género: Male
  - Nombre: es-UY-ValentinaNeural, Género: Female
  - Nombre: es-UY-MateoNeural, Género: Male
  - Nombre: es-VE-PaolaNeural, Género: Female
  - Nombre: es-VE-SebastianNeural, Género: Male """
# Nombre del archivo de audio de salida.
OUTPUT_FILE = "tts_example.mp3"


async def list_available_voices():
    """
    Imprime una lista de todas las voces disponibles en edge-tts,
    organizadas por idioma.
    """
    print("--- Listando Voces Disponibles ---")
    voices_by_lang = {}
    voices = await edge_tts.list_voices()
    for voice in voices:
        lang_prefix = voice["Locale"].split('-')[0]
        if lang_prefix not in voices_by_lang:
            voices_by_lang[lang_prefix] = []
        voices_by_lang[lang_prefix].append(voice)

    # Imprimir voces agrupadas por idioma
    for lang, voice_list in sorted(voices_by_lang.items()):
        print(f"\n--- Idioma: {lang} ---")
        for voice in voice_list:
            print(f"  - Nombre: {voice['ShortName']}, Género: {voice['Gender']}")

    print("\n--- Fin de la Lista de Voces ---")


async def generate_audio_sample():
    """
    Genera un archivo de audio a partir del texto y la voz definidos.
    """
    print(f"\n--- Generando muestra de audio con la voz: {VOICE} ---")
    try:
        communicate = edge_tts.Communicate(TEXT_TO_SPEAK, VOICE)
        await communicate.save(OUTPUT_FILE)
        print(f"¡Éxito! Audio guardado en: {os.path.abspath(OUTPUT_FILE)}")
    except Exception as e:
        print(f"Ocurrió un error al generar el audio: {e}")


async def main():
    """
    Función principal que ejecuta las tareas del experimento.
    """
    await list_available_voices()
    await generate_audio_sample()


if __name__ == "__main__":
    # Ejecuta la función asíncrona principal.
    # En Python 3.7+ puedes usar asyncio.run(main())
    # Esta implementación es compatible con versiones anteriores.
    loop = asyncio.get_event_loop_policy().get_event_loop()
    try:
        loop.run_until_complete(main())
    finally:
        loop.close()