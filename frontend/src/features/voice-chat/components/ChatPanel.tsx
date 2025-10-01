// frontend/src/features/voice-chat/components/ChatPanel.tsx

"use client";

import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Trash2 } from "lucide-react";
import { LongTermMemory, Message } from "@/services/api-client";

interface ChatPanelProps {
  setChatOpen: (open: boolean) => void;
  messages: Message[];
  setMessages: (msgs: Message[]) => void;
  setLongTermMemory: (mem: LongTermMemory) => void;
}

export default function ChatPanel({
  setChatOpen,
  messages,
  setMessages,
  setLongTermMemory,
}: ChatPanelProps) {
  const chatEndRef = useRef<HTMLDivElement>(null);

  // efecto para hacer scroll hacia el final cada vez que los mensajes cambian
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleClearHistoryAndMemory = () => {
    if (
      window.confirm(
        "¿Estás seguro de que quieres borrar el historial y la memoria de la conversación?"
      )
    ) {
      setMessages([]);
      setLongTermMemory({});
      localStorage.removeItem("lumen_messages");
      localStorage.removeItem("lumen_memory");
    }
  };

  return (
    <div className="h-full bg-gray-950 text-white flex flex-col">
      {/* cabecera del panel */}
      <div className="flex justify-between items-center p-3 border-b border-gray-800 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setChatOpen(false)}
          className="text-gray-400 hover:text-white rounded-full"
        >
          <X className="w-5 h-5" />
        </Button>
        <h2 className="text-lg font-semibold">Historial</h2>
        <Button
          variant="ghost"
          size="icon"
          // añadir estilos hover rojos para indicar acción destructiva
          className="text-gray-400 hover:text-red-500 rounded-full"
          onClick={handleClearHistoryAndMemory}
          title="Borrar historial y memoria"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
      {/* contenedor de mensajes */}
      <div className="p-4 overflow-y-auto flex-grow flex flex-col gap-4">
        {messages.length > 0 ? (
          messages.map((m, i) => (
            <div
              key={i}
              className={`flex w-full ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`py-3 px-4 max-w-[85%] break-words ${
                  m.role === "user"
                    ? "bg-gradient-to-br from-[#353759] to-[#2B2D53] border border-[#3A3C61]/50 rounded-3xl"
                    : "bg-transparent rounded-lg"
                }`}
              >
                <p className="text-base whitespace-pre-wrap">{m.content}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 text-center mt-8">
            El historial de la conversación aparecerá aquí
          </p>
        )}
        <div ref={chatEndRef} />
      </div>
    </div>
  );
}
