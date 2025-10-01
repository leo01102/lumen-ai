// frontend/src/app/voice-chat/page.tsx

"use client";

import { useState, useEffect, useCallback } from "react";
import VoiceSelectionModal from "@/features/voice-chat/components/VoiceSelectionModal";
import { useLumenChat } from "@/features/voice-chat/hooks/use-lumen-chat";
import { EmotionPayload } from "@/services/api-client";
import SettingsModal from "@/features/voice-chat/components/SettingsModal";
import VoiceChatMobileLayout from "@/features/voice-chat/components/VoiceChatMobileLayout";
import VoiceChatDesktopLayout from "@/features/voice-chat/components/VoiceChatDesktopLayout";

export default function VoiceChatPage() {
  // --- LOGICA PRINCIPAL Y ESTADOS ---

  // hook principal para la lógica del chat
  const {
    isAISpeaking,
    isUserSpeaking,
    isProcessing,
    error,
    messages,
    setMessages,
    setLongTermMemory,
    lastVocalEmotion,
    startUserSpeaking,
    stopUserSpeaking,
    processInteraction,
  } = useLumenChat();

  // estados locales de la ui
  const [isMicEnabled, setIsMicEnabled] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [showVoiceSelection, setShowVoiceSelection] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [currentFacialEmotion, setCurrentFacialEmotion] =
    useState<EmotionPayload | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [isDevMode, setIsDevMode] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isOrbAnimationEnabled, setIsOrbAnimationEnabled] = useState(true);

  // --- EFECTOS DE CICLO DE VIDA ---

  // detectar si el dispositivo es móvil para cambiar el layout
  useEffect(() => {
    const checkIfMobile = () => {
      const isMobileDevice =
        window.innerWidth < 768 ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );
      setIsMobile(isMobileDevice);
      setIsDevMode(!isMobileDevice);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // gestiona el inicio/parada automático del micrófono
  useEffect(() => {
    if (!isAISpeaking && !isProcessing && !isUserSpeaking && isMicEnabled) {
      startUserSpeaking();
    } else if (!isMicEnabled && isUserSpeaking) {
      stopUserSpeaking();
    }
  }, [
    isAISpeaking,
    isProcessing,
    isUserSpeaking,
    isMicEnabled,
    startUserSpeaking,
    stopUserSpeaking,
  ]);

  // comprueba si es la primera visita para mostrar el modal de voz
  useEffect(() => {
    const hasSelectedVoice = localStorage.getItem("selectedVoice");
    if (!hasSelectedVoice) setShowVoiceSelection(true);
    else setIsFirstTime(false);
  }, []);

  // --- MANEJADORES DE EVENTOS ---

  const handleVoiceSelected = (voice: string) => {
    localStorage.setItem("selectedVoice", voice);
    setShowVoiceSelection(false);
    setIsFirstTime(false);
  };

  const handleEndCall = () => {
    window.location.href = "/";
  };

  // detiene la grabación y envía el audio para ser procesado
  const handleStopAndProcess = useCallback(async () => {
    if (isUserSpeaking && !isProcessing) {
      const audioBlob = await stopUserSpeaking();
      if (audioBlob.size > 0) {
        await processInteraction(audioBlob, currentFacialEmotion);
      }
    }
  }, [
    isUserSpeaking,
    isProcessing,
    stopUserSpeaking,
    processInteraction,
    currentFacialEmotion,
  ]);

  // --- RENDERIZADO CONDICIONAL DEL LAYOUT ---
  return (
    <div className="min-h-screen h-screen bg-black text-white overflow-hidden relative">
      {isMobile ? (
        <VoiceChatMobileLayout
          chatOpen={chatOpen}
          setChatOpen={setChatOpen}
          isAISpeaking={isAISpeaking}
          isUserSpeaking={isUserSpeaking}
          isProcessing={isProcessing}
          error={error}
          messages={messages}
          setMessages={setMessages}
          setLongTermMemory={setLongTermMemory}
          isOrbAnimationEnabled={isOrbAnimationEnabled}
          isDevMode={isDevMode}
          isVideoOn={isVideoOn}
          isMicEnabled={isMicEnabled}
          currentFacialEmotion={currentFacialEmotion}
          lastVocalEmotion={lastVocalEmotion}
          setCurrentFacialEmotion={setCurrentFacialEmotion}
          setIsVideoOn={setIsVideoOn}
          setIsMicEnabled={setIsMicEnabled}
          handleEndCall={handleEndCall}
          handleStopAndProcess={handleStopAndProcess}
          setShowSettings={setShowSettings}
        />
      ) : (
        <VoiceChatDesktopLayout
          chatOpen={chatOpen}
          setChatOpen={setChatOpen}
          isAISpeaking={isAISpeaking}
          isUserSpeaking={isUserSpeaking}
          isProcessing={isProcessing}
          error={error}
          messages={messages}
          setMessages={setMessages}
          setLongTermMemory={setLongTermMemory}
          isOrbAnimationEnabled={isOrbAnimationEnabled}
          isDevMode={isDevMode}
          isVideoOn={isVideoOn}
          isMicEnabled={isMicEnabled}
          currentFacialEmotion={currentFacialEmotion}
          lastVocalEmotion={lastVocalEmotion}
          setCurrentFacialEmotion={setCurrentFacialEmotion}
          setIsVideoOn={setIsVideoOn}
          setIsMicEnabled={setIsMicEnabled}
          handleEndCall={handleEndCall}
          handleStopAndProcess={handleStopAndProcess}
          setShowSettings={setShowSettings}
        />
      )}

      {/* modales que se renderizan sobre el layout */}
      <VoiceSelectionModal
        isOpen={showVoiceSelection}
        onClose={() => setShowVoiceSelection(false)}
        onVoiceSelected={handleVoiceSelected}
        isFirstTime={isFirstTime}
      />

      <SettingsModal
        isOpen={showSettings}
        onOpenChange={setShowSettings}
        isMobile={isMobile}
        isDevMode={isDevMode}
        setIsDevMode={setIsDevMode}
        isOrbAnimationEnabled={isOrbAnimationEnabled}
        setIsOrbAnimationEnabled={setIsOrbAnimationEnabled}
        onShowVoiceSelection={() => {
          setShowSettings(false);
          setShowVoiceSelection(true);
        }}
      />
    </div>
  );
}
