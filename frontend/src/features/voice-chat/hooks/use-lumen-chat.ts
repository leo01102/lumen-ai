// frontend/src/features/voice-chat/hooks/use-lumen-chat.ts

import { useState, useEffect, useCallback, useRef } from "react";
import {
  createNewSession,
  sendInteraction,
  InteractionResponse,
  LongTermMemory,
  EmotionPayload,
  VocalEmotionResult,
} from "@/services/api-client";

export const useLumenChat = () => {
  // --- ESTADOS DEL CHAT ---
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );
  const [longTermMemory, setLongTermMemory] = useState<LongTermMemory>({});
  const [lastVocalEmotion, setLastVocalEmotion] =
    useState<VocalEmotionResult | null>(null);

  // --- ESTADOS DE LA UI ---
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- REFS ---
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // --- EFECTOS (HOOKS) ---

  // efecto para recuperar datos guardados en localStorage al montar el hook
  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedSession = Number(localStorage.getItem("lumen_session")) || null;
    const savedMessages = JSON.parse(
      localStorage.getItem("lumen_messages") || "[]"
    );
    const savedMemory = JSON.parse(
      localStorage.getItem("lumen_memory") || "{}"
    );

    if (savedSession) setSessionId(savedSession);
    if (savedMessages.length > 0) setMessages(savedMessages);
    if (Object.keys(savedMemory).length > 0) setLongTermMemory(savedMemory);
  }, []);

  // efecto para guardar sesión en localStorage cuando cambie
  useEffect(() => {
    if (sessionId) localStorage.setItem("lumen_session", sessionId.toString());
  }, [sessionId]);

  // efecto para guardar mensajes en localStorage cuando cambien
  useEffect(() => {
    // solo guardar si hay mensajes para no sobreescribir con un array vacío al inicio
    if (messages.length > 0) {
      localStorage.setItem("lumen_messages", JSON.stringify(messages));
    }
  }, [messages]);

  // efecto para guardar memoria a largo plazo en localStorage cuando cambie
  useEffect(() => {
    if (Object.keys(longTermMemory).length > 0) {
      localStorage.setItem("lumen_memory", JSON.stringify(longTermMemory));
    }
  }, [longTermMemory]);

  // efecto para inicializar la sesion en backend si no hay una guardada
  useEffect(() => {
    if (sessionId) return; // si ya tenemos una sesión de localStorage, no crear una nueva

    const initializeSession = async () => {
      try {
        const data = await createNewSession();
        setSessionId(data.session_id);
      } catch (e: unknown) {
        setError("No se pudo conectar con el backend de Lumen");
        console.error(e);
      }
    };
    initializeSession();
  }, [sessionId]);

  // funcion principal para procesar la interaccion del usuario
  const processInteraction = useCallback(
    async (audioBlob: Blob, facialEmotion: EmotionPayload | null) => {
      if (!sessionId || isProcessing) return;

      // inmediatamente establecer el estado de procesamiento
      setIsProcessing(true);
      setError(null);

      try {
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = (reader.result as string).split(",")[1];

          const facialEmotionData = facialEmotion || {
            stable_dominant_emotion: "neutral",
            average_scores: null,
          };

          const response: InteractionResponse = await sendInteraction({
            session_id: sessionId,
            audio_b64: base64Audio,
            facial_emotion: facialEmotionData,
            chat_history: messages,
            long_term_memory: longTermMemory,
          });

          setMessages(response.updated_chat_history);
          setLongTermMemory((prev) => ({
            ...prev,
            ...response.extracted_memory,
          }));
          if (response.vocal_analysis_result) {
            setLastVocalEmotion(response.vocal_analysis_result);
          }

          if (response.ai_audio_b64) {
            const audio = new Audio(
              `data:audio/mp3;base64,${response.ai_audio_b64}`
            );
            setIsAISpeaking(true);
            audio.play();
            audio.onended = () => setIsAISpeaking(false);
          }

          // terminar el procesamiento después de que todo esté listo
          setIsProcessing(false);
        };
      } catch (e: unknown) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("Ocurrió un error desconocido");
        }
        console.error(e);
        setIsProcessing(false);
      }
    },
    [sessionId, isProcessing, messages, longTermMemory]
  );

  // --- MANEJO DE GRABACION ---

  const startRecording = useCallback(() => {
    if (isUserSpeaking) return;

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        mediaRecorderRef.current = new MediaRecorder(stream);
        mediaRecorderRef.current.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };
        audioChunksRef.current = [];
        mediaRecorderRef.current.start();
        setIsUserSpeaking(true);
      })
      .catch((err) => {
        console.error("Error al acceder al micrófono:", err);
        setError("No se pudo acceder al micrófono. Comprueba los permisos.");
      });
  }, [isUserSpeaking]);

  const stopRecording = useCallback(() => {
    return new Promise<Blob>((resolve) => {
      const recorder = mediaRecorderRef.current; // capturar la instancia actual

      if (recorder && recorder.state === "recording") {
        // asignar el handler de 'onstop' a la instancia capturada
        recorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, {
            type: "audio/webm",
          });
          audioChunksRef.current = [];
          // usar el stream de la instancia capturada para la limpieza
          const stream = recorder.stream;
          if (stream) {
            stream.getTracks().forEach((track) => track.stop());
          }
          resolve(audioBlob);
        };

        recorder.stop();
        setIsUserSpeaking(false);
      } else {
        resolve(new Blob());
      }
    });
  }, []);

  const restartRecording = useCallback(async () => {
    await stopRecording();
    startRecording();
  }, [stopRecording, startRecording]);

  return {
    isAISpeaking,
    isUserSpeaking,
    isProcessing,
    error,
    messages,
    setMessages,
    longTermMemory,
    setLongTermMemory,
    lastVocalEmotion,
    startUserSpeaking: startRecording,
    stopUserSpeaking: stopRecording,
    processInteraction,
    restartRecording,
  };
};
