// frontend/src/features/voice-chat/components/VoiceChatDesktopLayout.tsx

"use client";

import { Button } from "@/components/ui/button";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  MoreHorizontal,
  X,
  Settings,
  LoaderCircle,
  Square,
  MessageSquareText,
} from "lucide-react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
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

// definir todas las props con tipos estrictos para el layout
interface VoiceChatDesktopLayoutProps {
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

export default function VoiceChatDesktopLayout({
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
}: VoiceChatDesktopLayoutProps) {
  return (
    <ResizablePanelGroup direction="horizontal" className="w-full h-full">
      {/* panel del chat, solo se muestra si está abierto */}
      {chatOpen && (
        <>
          <ResizablePanel defaultSize={33} minSize={25} maxSize={50} order={1}>
            <ChatPanel
              setChatOpen={setChatOpen}
              messages={messages}
              setMessages={setMessages}
              setLongTermMemory={setLongTermMemory}
            />
          </ResizablePanel>
          <ResizableHandle withHandle />
        </>
      )}

      {/* panel principal de la interfaz */}
      <ResizablePanel defaultSize={chatOpen ? 67 : 100} order={2}>
        <div className="relative w-full h-full">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20 -z-10" />

          {/* boton para abrir el chat si está cerrado */}
          {!chatOpen && (
            <div className="absolute top-6 left-6 z-50">
              <Button
                onClick={() => setChatOpen(true)}
                className="bg-gray-800/80 text-white rounded-full px-4 py-2 shadow-lg hover:bg-gray-700 backdrop-blur-sm flex items-center gap-2"
                title="Mostrar Historial"
              >
                <MessageSquareText className="w-5 h-5" />
                Chat
              </Button>
            </div>
          )}

          {/* boton de ajustes (siempre visible) */}
          <div className="absolute top-6 right-6 z-20">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSettings(true)}
              className="text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-full"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>

          {/* contenido central: orbe y boton de accion */}
          <div className="relative z-10 flex flex-col items-center justify-center min-h-screen gap-8">
            <VoiceChatOrb
              isAISpeaking={isAISpeaking}
              isUserSpeaking={isUserSpeaking}
              isPaused={!isOrbAnimationEnabled}
            />

            <Button
              onClick={handleStopAndProcess}
              disabled={
                isProcessing || isAISpeaking || !isMicEnabled || !isUserSpeaking
              }
              className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white flex items-center justify-center transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <LoaderCircle className="w-8 h-8 animate-spin" />
              ) : isAISpeaking ? (
                <Mic className="w-8 h-8 opacity-50" />
              ) : isUserSpeaking ? (
                <Square className="w-8 h-8" />
              ) : (
                <Mic className="w-8 h-8 opacity-50" />
              )}
            </Button>

            {/* texto de estado */}
            <p className="text-gray-400 h-6 text-center">
              {isProcessing
                ? "Procesando..."
                : isAISpeaking
                ? "Lumen está hablando..."
                : isUserSpeaking
                ? "Escuchando... haz clic para enviar"
                : !isMicEnabled
                ? "Micrófono silenciado"
                : ""}
            </p>

            {error && <p className="text-red-500 text-center mt-4">{error}</p>}
          </div>

          {/* herramientas de desarrollo (visibles solo en dev mode) */}
          {isDevMode && (
            <div className="absolute top-20 left-6 w-48 md:w-64 z-40 space-y-2">
              <Accordion type="single" collapsible>
                <AccordionItem
                  value="camera-view"
                  className="bg-gray-900/80 backdrop-blur-md border border-gray-700 rounded-lg px-4"
                >
                  <AccordionTrigger className="text-white hover:no-underline py-3">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm">Vista de Cámara</h3>
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
                facialEmotion={currentFacialEmotion}
                vocalEmotion={lastVocalEmotion}
              />
            </div>
          )}

          {/* barra de controles inferior */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
            <div className="flex items-center gap-4 px-6 py-4 bg-gray-900/80 backdrop-blur-lg rounded-full border border-gray-700/50">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMicEnabled(!isMicEnabled)}
                className={`rounded-full w-12 h-12 ${
                  isMicEnabled
                    ? "text-white bg-white/10"
                    : "text-red-400 bg-red-500/20 hover:bg-red-500/30"
                }`}
              >
                {isMicEnabled ? (
                  <Mic className="w-5 h-5" />
                ) : (
                  <MicOff className="w-5 h-5" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsVideoOn(!isVideoOn)}
                className={`rounded-full w-12 h-12 ${
                  isVideoOn
                    ? "text-white bg-white/10"
                    : "text-gray-400 hover:bg-gray-700"
                }`}
              >
                {isVideoOn ? (
                  <Video className="w-5 h-5" />
                ) : (
                  <VideoOff className="w-5 h-5" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full w-12 h-12 text-gray-400 hover:text-white hover:bg-gray-700"
              >
                <MoreHorizontal className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleEndCall}
                className="rounded-full w-12 h-12 text-red-400 hover:text-red-300 hover:bg-red-500/20"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
