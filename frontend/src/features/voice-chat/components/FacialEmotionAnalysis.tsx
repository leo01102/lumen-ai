// frontend/src/features/voice-chat/components/FacialEmotionAnalysis.tsx

"use client";

import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import { EmotionPayload } from "@/services/api-client";

// --- constantes de configuracion ---
const FRAME_SKIP = 5; // analizar 1 de cada 5 fotogramas para optimizar rendimiento
const BUFFER_SIZE = 10; // guardar los ultimos 10 analisis para suavizar el resultado
const NO_FACE_TIMEOUT = 2000; // 2 segundos en milisegundos

// tipo explicito para las claves de emocion
type EmotionKey =
  | "neutral"
  | "happy"
  | "sad"
  | "angry"
  | "fearful"
  | "disgusted"
  | "surprised";

interface FacialEmotionAnalysisProps {
  onEmotionUpdate: (emotionData: EmotionPayload | null) => void;
  isVideoOn: boolean;
}

export default function FacialEmotionAnalysis({
  onEmotionUpdate,
  isVideoOn,
}: FacialEmotionAnalysisProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastDetectionTime, setLastDetectionTime] = useState<number>(0);

  // usamos useref para el buffer para que no cause re-renders
  const emotionBuffer = useRef<faceapi.FaceExpressions[]>([]).current;

  // efecto: gestiona el ciclo de vida de la cámara y los modelos
  useEffect(() => {
    const loadModelsAndStartVideo = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // cargar los modelos desde /public/models
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
          faceapi.nets.faceExpressionNet.loadFromUri("/models"),
        ]);

        // solicitar acceso a la camara
        const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsLoading(false);
      } catch (err) {
        console.error("Error al cargar modelos o iniciar la cámara:", err);
        setError(
          "No se pudo acceder a la cámara. Revisa los permisos del navegador."
        );
        setIsLoading(false);
      }
    };

    if (isVideoOn) {
      loadModelsAndStartVideo();
    } else {
      // apagar la camara para liberar recursos
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    }
  }, [isVideoOn]);

  // efecto: inicia y limpia el intervalo del análisis facial
  useEffect(() => {
    const analyzeVideo = setInterval(async () => {
      if (videoRef.current && !videoRef.current.paused && isVideoOn) {
        const detections = await faceapi
          .detectAllFaces(
            videoRef.current,
            new faceapi.TinyFaceDetectorOptions()
          )
          .withFaceExpressions();

        if (detections.length > 0) {
          setLastDetectionTime(Date.now()); // actualizar el tiempo de la ultima deteccion
          const expressions = detections[0].expressions;

          // añadir al buffer y mantener su tamaño
          emotionBuffer.push(expressions);
          if (emotionBuffer.length > BUFFER_SIZE) {
            emotionBuffer.shift();
          }

          // calcular el estado emocional agregado del buffer
          const avgScores: { [key: string]: number } = {};
          const emotionLabels = Object.keys(expressions) as EmotionKey[];

          emotionLabels.forEach((label: EmotionKey) => {
            avgScores[label] =
              emotionBuffer.reduce((acc, curr) => acc + curr[label], 0) /
              emotionBuffer.length;
          });

          const dominantEmotion = Object.keys(avgScores).reduce((a, b) =>
            avgScores[a] > avgScores[b] ? a : b
          );

          // enviar el resultado agregado al componente padre
          onEmotionUpdate({
            stable_dominant_emotion: dominantEmotion,
            average_scores: avgScores,
          });
        } else {
          // logica "pegajosa": solo enviar 'null' si la cara se pierde por un tiempo
          if (Date.now() - lastDetectionTime > NO_FACE_TIMEOUT) {
            onEmotionUpdate(null);
          }
        }
      }
    }, 1000 / FRAME_SKIP); // frecuencia de analisis

    // limpiar el intervalo al desmontar el componente
    return () => clearInterval(analyzeVideo);
  }, [onEmotionUpdate, isVideoOn, emotionBuffer, lastDetectionTime]);

  if (!isVideoOn) {
    return (
      <div className="w-full h-full flex items-center justify-center text-center p-4 bg-gray-800/50 rounded-lg text-sm">
        Cámara desactivada.
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-400">
          Cargando cámara...
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center text-red-500 text-xs text-center p-2">
          {error}
        </div>
      )}
      {/* 'muted' y 'playsInline' son cruciales para el autoplay */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="w-full h-full object-cover"
      />
    </div>
  );
}
