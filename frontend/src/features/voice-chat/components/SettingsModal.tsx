// frontend/src/features/voice-chat/components/SettingsModal.tsx

"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Monitor, Smartphone } from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isMobile: boolean;
  isDevMode: boolean;
  setIsDevMode: (devMode: boolean) => void;
  isOrbAnimationEnabled: boolean;
  setIsOrbAnimationEnabled: (enabled: boolean) => void;
  onShowVoiceSelection: () => void;
}

export default function SettingsModal({
  isOpen,
  onOpenChange,
  isMobile,
  isDevMode,
  setIsDevMode,
  isOrbAnimationEnabled,
  setIsOrbAnimationEnabled,
  onShowVoiceSelection,
}: SettingsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-sm mx-auto">
        <DialogHeader>
          <DialogTitle>Ajustes</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* opcion: modo desarrollador */}
          <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700">
            <div className="flex items-center gap-3">
              {isMobile ? (
                <Smartphone className="w-5 h-5 text-gray-400" />
              ) : (
                <Monitor className="w-5 h-5 text-gray-400" />
              )}
              <div>
                <p className="text-sm font-medium">Modo Desarrollador</p>
                <p className="text-xs text-gray-400">
                  {isMobile
                    ? "Muestra herramientas de debug"
                    : "Oculta herramientas de debug"}
                </p>
              </div>
            </div>
            <Button
              variant={isDevMode ? "default" : "outline"}
              size="sm"
              onClick={() => setIsDevMode(!isDevMode)}
              className={`text-xs ${
                isDevMode
                  ? "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30"
                  : "border-gray-600 hover:bg-gray-800"
              }`}
            >
              {isDevMode ? "ACTIVADO" : "DESACTIVADO"}
            </Button>
          </div>

          {/* opcion: animacion del orbe */}
          <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 opacity-70"></div>
              <div>
                <p className="text-sm font-medium">Animación del Orbe</p>
                <p className="text-xs text-gray-400">
                  Pausar para mejorar rendimiento
                </p>
              </div>
            </div>
            <Button
              variant={isOrbAnimationEnabled ? "default" : "outline"}
              size="sm"
              onClick={() => setIsOrbAnimationEnabled(!isOrbAnimationEnabled)}
              className={`text-xs ${
                isOrbAnimationEnabled
                  ? "bg-purple-500/20 text-purple-400 hover:bg-purple-500/30"
                  : "border-gray-600 hover:bg-gray-800"
              }`}
            >
              {isOrbAnimationEnabled ? "ACTIVADA" : "DESACTIVADA"}
            </Button>
          </div>

          {/* boton: cambiar voz */}
          <Button
            variant="outline"
            onClick={onShowVoiceSelection}
            className="w-full border-gray-600 text-white hover:bg-gray-800"
          >
            Cambiar Voz de IA
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
