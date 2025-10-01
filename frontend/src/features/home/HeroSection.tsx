// frontend/src/features/home/HeroSection.tsx

"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Github } from "lucide-react";
import Link from "next/link";
import PulsingBorderShader from "@/features/voice-chat/components/PulsingBorderShader";

export default function HeroSection() {
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* gradiente de fondo */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20" />

      {/* contenido principal */}
      <div className="relative z-10 container mx-auto px-4 py-16 sm:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh] pt-12 lg:pt-0">
          {/* contenido de texto */}
          <div className="space-y-8 lg:pr-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-sm mx-auto lg:mx-0">
              <Sparkles className="w-4 h-4" />
              Tu asistente IA de bienestar
            </div>

            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-tight">
                Conocé a{" "}
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  Lumen
                </span>
              </h1>

              <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Descubrí el futuro del bienestar mental.
                <br />
                <span className="font-bold">Lumen</span> es un asistente IA que
                te entiende, aprende de vos y te apoya 24/7 para una vida
                equilibrada.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start">
              <Link href="/voice-chat" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-6 text-lg rounded-full group w-full"
                >
                  Conversá con Lumen
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>

              <Link
                href="https://github.com/leo01102/lumen-ai"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="border-gray-600 text-white hover:bg-gray-800 px-8 py-6 text-lg rounded-full bg-transparent w-full"
                >
                  <Github className="w-5 h-5" />
                  Repositorio
                </Button>
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-8 pt-8 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Disponible 24/7
              </div>
              <div>Acceso inmediato</div>
              <div>Privado por diseño</div>
            </div>
          </div>

          {/* animacion */}
          <div className="flex justify-center lg:justify-end order-first lg:order-last pb-8 lg:pb-0">
            {/* contenedor principal de la animación con tamaño responsive */}
            <div className="relative w-[280px] sm:w-[350px] lg:w-[580px] aspect-square">
              {/* efecto de brillo */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-3xl" />

              {/* componente del shader ahora ocupa el 100% de su contenedor padre */}
              <PulsingBorderShader className="w-full h-full" />

              {/* elementos flotantes (se posicionan relativos al contenedor de arriba) */}
              <div
                className="absolute -top-4 -right-4 w-3 h-3 bg-purple-400 rounded-full animate-bounce"
                style={{ animationDelay: "0s" }}
              />
              <div
                className="absolute top-1/3 -left-6 w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                style={{ animationDelay: "1s" }}
              />
              <div
                className="absolute bottom-1/4 -right-8 w-4 h-4 bg-pink-400 rounded-full animate-bounce"
                style={{ animationDelay: "2s" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* gradiente inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
    </div>
  );
}
