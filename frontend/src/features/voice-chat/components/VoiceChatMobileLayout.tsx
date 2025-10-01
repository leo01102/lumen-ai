// frontend/src/features/voice-chat/components/VoiceChatMobileLayout.tsx

"use client";

import { Button } from "@/components/ui/button";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  X,
  Settings,
  LoaderCircle,
  Square,
  MessageSquareText,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import VoiceChatOrb from "./VoiceChatOrb";
import ChatPanel from "./ChatPanel";
import FacialEmotionAnalysis from "./FacialEmotionAnalysis";
import DebugView from "./DebugView";
import {
  EmotionPayload,
  VocalEmotionResult,
  LongTermMemory,
  Message,
} from "@/services/api-client";

// definir todas las props con tipos estrictos para el layout movil
interface VoiceChatMobileLayoutProps {
  chatOpen: boolean;
  setChatOpen: (open: boolean) => void;
  isAISpeaking: boolean;
  isUserSpeaking: boolean;
  isProcessing: boolean;
  error: string | null;
  messages: Message[];
  setMessages: (msgs: Message[]) => void;
  setLongTermMemory: (mem: LongTermMemory) => void;
  isOrbAnimationEnabled: boolean;
  isDevMode: boolean;
  isVideoOn: boolean;
  isMicEnabled: boolean;
  currentFacialEmotion: EmotionPayload | null;
  lastVocalEmotion: VocalEmotionResult | null;
  setCurrentFacialEmotion: (emotion: EmotionPayload | null) => void;
  setIsVideoOn: (on: boolean) => void;
  setIsMicEnabled: (enabled: boolean) => void;
  handleEndCall: () => void;
  handleStopAndProcess: () => void;
  setShowSettings: (show: boolean) => void;
}

export default function VoiceChatMobileLayout({
  chatOpen,
  setChatOpen,
  isAISpeaking,
  isUserSpeaking,
  isProcessing,
  error,
  messages,
  setMessages,
  setLongTermMemory,
  isOrbAnimationEnabled,
  isDevMode,
  isVideoOn,
  isMicEnabled,
  currentFacialEmotion,
  lastVocalEmotion,
  setCurrentFacialEmotion,
  setIsVideoOn,
  setIsMicEnabled,
  handleEndCall,
  handleStopAndProcess,
  setShowSettings,
}: VoiceChatMobileLayoutProps) {
  return (
    <div className="flex flex-col h-full">
      {/* panel del chat (ocupa la mitad superior si está abierto) */}
      {chatOpen && (
        <div className="h-1/2 border-b border-gray-800">
          <ChatPanel
            setChatOpen={setChatOpen}
            messages={messages}
            setMessages={setMessages}
            setLongTermMemory={setLongTermMemory}
          />
        </div>
      )}

      {/* contenedor principal (ocupa toda la pantalla o la mitad inferior) */}
      <div
        className={`${chatOpen ? "h-1/2" : "h-full"} relative flex flex-col`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20 -z-10" />

        {/* cabecera superior con botones de chat y ajustes */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-50">
          {!chatOpen && (
            <Button
              onClick={() => setChatOpen(true)}
              className="bg-gray-800/80 text-white rounded-full px-3 py-2 shadow-lg hover:bg-gray-700 backdrop-blur-sm flex items-center gap-2 text-sm"
              title="Mostrar Historial"
            >
              <MessageSquareText className="w-4 h-4" />
              Chat
            </Button>
          )}
          {/* placeholder para mantener el boton de ajustes a la derecha */}
          {chatOpen && <div></div>}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSettings(true)}
            className="text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-full w-10 h-10"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>

        {/* contenido central: orbe y texto de estado */}
        <div className="flex-grow flex flex-col items-center justify-center gap-4 px-4 overflow-hidden">
          <div className="scale-75">
            <VoiceChatOrb
              isAISpeaking={isAISpeaking}
              isUserSpeaking={isUserSpeaking}
              isPaused={chatOpen || !isOrbAnimationEnabled}
            />
          </div>

          <p className="text-gray-400 text-center text-sm px-4 h-5">
            {isProcessing
              ? "Procesando..."
              : isAISpeaking
              ? "Lumen está hablando..."
              : isUserSpeaking
              ? "Escuchando... toca para enviar"
              : !isMicEnabled
              ? "Micrófono silenciado"
              : ""}
          </p>
          {error && (
            <p className="text-red-500 text-center text-sm px-4">{error}</p>
          )}
        </div>

        {/* controles inferiores: boton principal y barra de acciones */}
        <div className="shrink-0 w-full flex flex-col items-center gap-4 pb-6 z-20">
          <Button
            onClick={handleStopAndProcess}
            disabled={
              isProcessing || isAISpeaking || !isMicEnabled || !isUserSpeaking
            }
            className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white flex items-center justify-center transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <LoaderCircle className="w-6 h-6 animate-spin" />
            ) : isAISpeaking ? (
              <Mic className="w-6 h-6 opacity-50" />
            ) : isUserSpeaking ? (
              <Square className="w-6 h-6" />
            ) : (
              <Mic className="w-6 h-6 opacity-50" />
            )}
          </Button>
          <div className="flex items-center gap-3 px-4 py-3 bg-gray-900/80 backdrop-blur-lg rounded-full border border-gray-700/50">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMicEnabled(!isMicEnabled)}
              className={`rounded-full w-10 h-10 ${
                isMicEnabled
                  ? "text-white bg-white/10"
                  : "text-red-400 bg-red-500/20 hover:bg-red-500/30"
              }`}
            >
              {isMicEnabled ? (
                <Mic className="w-4 h-4" />
              ) : (
                <MicOff className="w-4 h-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsVideoOn(!isVideoOn)}
              className={`rounded-full w-10 h-10 ${
                isVideoOn
                  ? "text-white bg-white/10"
                  : "text-gray-400 hover:bg-gray-700"
              }`}
            >
              {isVideoOn ? (
                <Video className="w-4 h-4" />
              ) : (
                <VideoOff className="w-4 h-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleEndCall}
              className="rounded-full w-10 h-10 text-red-400 hover:text-red-300 hover:bg-red-500/20"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* herramientas de desarrollo (solo en modo dev) */}
        {isDevMode && (
          <div className="absolute top-16 left-4 w-40 z-40 space-y-2">
            <Accordion type="single" collapsible>
              <AccordionItem
                value="camera-view"
                className="bg-gray-900/80 backdrop-blur-md border border-gray-700 rounded-lg px-2"
              >
                <AccordionTrigger className="text-white hover:no-underline py-2">
                  <div className="flex items-center gap-1">
                    <h3 className="font-bold text-xs">Cámara</h3>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="w-full aspect-video">
                    <FacialEmotionAnalysis
                      isVideoOn={isVideoOn}
                      onEmotionUpdate={setCurrentFacialEmotion}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <DebugView
              isMobile
              facialEmotion={currentFacialEmotion}
              vocalEmotion={lastVocalEmotion}
            />
          </div>
        )}
      </div>
    </div>
  );
}
