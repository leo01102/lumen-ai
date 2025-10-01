// frontend/src/features/voice-chat/components/VoiceChatOrb.tsx

"use client";

import { useEffect, useState } from "react";
import PulsingBorderShader from "@/features/voice-chat/components/PulsingBorderShader";

interface VoiceChatOrbProps {
  isAISpeaking: boolean;
  isUserSpeaking: boolean;
  isPaused?: boolean;
}

export default function VoiceChatOrb({
  isAISpeaking,
  isUserSpeaking,
  isPaused = false, // valor por defecto: no pausado
}: VoiceChatOrbProps) {
  const [pulseIntensity, setPulseIntensity] = useState(1);

  // efecto: ajusta la intensidad del pulso cuando la ia habla
  useEffect(() => {
    if (isAISpeaking) {
      setPulseIntensity(1.5);
    } else {
      setPulseIntensity(1);
    }
  }, [isAISpeaking]);

  return (
    <div className="relative">
      {/* efecto de brillo mejorado cuando la ia habla */}
      <div
        className={`absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-3xl scale-110 transition-all duration-500 ${
          isAISpeaking ? "scale-125 opacity-100" : "scale-110 opacity-70"
        }`}
      />

      {/* orbe principal con animacion mejorada */}
      <div className="relative">
        <div
          className={`transition-transform duration-300 ${
            isAISpeaking ? "scale-105" : "scale-100"
          }`}
        >
          {/* las props de animacion se anulan si el orbe está pausado */}
          <PulsingBorderShader
            // ¡ESTA ES LA CORRECCIÓN! Le damos un tamaño explícito.
            className="w-[535px] h-[511px]"
            intensity={pulseIntensity}
            pulse={isPaused ? 0 : isAISpeaking ? 0.4 : 0.2}
            speed={isPaused ? 0 : isAISpeaking ? 2 : 1.5}
          />
        </div>

        {/* indicador de que el usuario habla */}
        {isUserSpeaking && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  // se aplica la animacion de pulso condicionalmente
                  className={`w-1 bg-white rounded-full ${
                    !isPaused && "animate-pulse"
                  }`}
                  style={{
                    height: `${Math.random() * 20 + 10}px`,
                    animationDelay: `${i * 0.1}s`,
                    animationDuration: "0.5s",
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* elementos flotantes con animacion mas dinamica */}
      {/* la animacion de rebote tambien se desactiva si está pausado */}
      <div
        className={`absolute -top-4 -right-4 w-3 h-3 bg-purple-400 rounded-full transition-all duration-300 ${
          isAISpeaking && !isPaused ? "animate-bounce" : ""
        } ${isAISpeaking ? "scale-125" : ""}`}
        style={{ animationDelay: "0s" }}
      />
      <div
        className={`absolute top-1/3 -left-6 w-2 h-2 bg-blue-400 rounded-full transition-all duration-300 ${
          isAISpeaking && !isPaused ? "animate-bounce" : ""
        } ${isAISpeaking ? "scale-125" : ""}`}
        style={{ animationDelay: "1s" }}
      />
      <div
        className={`absolute bottom-1/4 -right-8 w-4 h-4 bg-pink-400 rounded-full transition-all duration-300 ${
          isAISpeaking && !isPaused ? "animate-bounce" : ""
        } ${isAISpeaking ? "scale-125" : ""}`}
        style={{ animationDelay: "2s" }}
      />
    </div>
  );
}
