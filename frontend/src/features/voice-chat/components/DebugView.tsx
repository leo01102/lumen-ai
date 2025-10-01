// frontend/src/features/voice-chat/components/DebugView.tsx

"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { EmotionPayload, VocalEmotionResult } from "@/services/api-client";

interface DebugViewProps {
  facialEmotion: EmotionPayload | null;
  vocalEmotion: VocalEmotionResult | null;
  isMobile?: boolean;
}

export default function DebugView({
  facialEmotion,
  vocalEmotion,
  isMobile = false,
}: DebugViewProps) {
  // --- FUNCIÓN REPLACER PARA JSON.STRINGIFY ---
  const jsonReplacer = (key: string, value: unknown) => {
    if (typeof value === "number") {
      return parseFloat(value.toFixed(4));
    }
    return value;
  };

  return (
    <Accordion type="single" collapsible>
      <AccordionItem
        value="debug-info"
        // se ajusta el padding en móvil para ser más compacto
        className={`bg-gray-900/80 backdrop-blur-md border border-gray-700 rounded-lg ${
          isMobile ? "px-2" : "px-4"
        }`}
      >
        <AccordionTrigger
          // se ajusta el padding del trigger también
          className={`text-white hover:no-underline ${
            isMobile ? "py-2" : "py-3"
          }`}
        >
          <div className="flex items-center gap-2">
            {/* se oculta el texto "View" en móvil por espacio */}
            <h3 className="font-bold text-xs">
              Debug{isMobile ? "" : " View"}
            </h3>
            <span className="text-xs font-semibold bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full">
              DEV
            </span>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="font-mono text-xs text-gray-300 max-h-40 overflow-y-auto">
            <p className="font-semibold text-purple-400">
              Emoción Facial (en vivo):
            </p>
            <pre className="whitespace-pre-wrap break-all">
              {facialEmotion
                ? // la llamada a stringify sigue siendo la misma
                  JSON.stringify(facialEmotion, jsonReplacer, 2)
                : "No se detecta cara"}
            </pre>
            <p className="font-semibold text-blue-400 mt-2">
              Emoción Vocal (última interacción):
            </p>
            <pre className="whitespace-pre-wrap break-all">
              {vocalEmotion
                ? JSON.stringify(vocalEmotion, jsonReplacer, 2)
                : "N/A"}
            </pre>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
