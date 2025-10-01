// frontend/src/features/voice-chat/components/VoiceSelectionModal.tsx

"use client";

import { useState, MouseEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Volume2 } from "lucide-react";

interface VoiceSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVoiceSelected: (voice: string) => void;
  isFirstTime: boolean;
}

const voices = [
  { id: "sarah", name: "Sarah", description: "Cálida y empática" },
  { id: "alex", name: "Alex", description: "Calmada y profesional" },
  { id: "jordan", name: "Jordan", description: "Amigable y de apoyo" },
  { id: "riley", name: "Riley", description: "Gentil y comprensiva" },
];

export default function VoiceSelectionModal({
  isOpen,
  onClose,
  onVoiceSelected,
  isFirstTime,
}: VoiceSelectionModalProps) {
  // estado para la voz seleccionada
  const [selectedVoice, setSelectedVoice] = useState<string>("");

  // --- manejadores de eventos ---
  const handleVoiceSelect = (voiceId: string) => {
    setSelectedVoice(voiceId);
  };

  const handleConfirm = () => {
    if (selectedVoice) {
      onVoiceSelected(selectedVoice);
    }
  };

  // placeholder para la previsualización de voz
  const handlePreview = (voiceId: string) => {
    console.log(`[Lumen] Playing preview for voice: ${voiceId}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={isFirstTime ? undefined : onClose}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            {isFirstTime ? "Elige una voz para Lumen" : "Seleccionar Voz"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 py-4">
          {voices.map((voice) => (
            <div
              key={voice.id}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                selectedVoice === voice.id
                  ? "border-purple-500 bg-purple-500/10"
                  : "border-gray-600 hover:border-gray-500 hover:bg-gray-800/50"
              }`}
              onClick={() => handleVoiceSelect(voice.id)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{voice.name}</h3>
                  <p className="text-sm text-gray-400">{voice.description}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e: MouseEvent<HTMLButtonElement>) => {
                    e.stopPropagation(); // evitar que el click seleccione la voz
                    handlePreview(voice.id);
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <Volume2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3 pt-4">
          {!isFirstTime && (
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-gray-600 text-white hover:bg-gray-800 bg-transparent"
            >
              Cancelar
            </Button>
          )}
          <Button
            onClick={handleConfirm}
            disabled={!selectedVoice}
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            {isFirstTime ? "Iniciar Sesión" : "Confirmar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
