import { ChevronRight } from "lucide-react";
import type { StepProps } from "../types";
import { useState } from "react";
import dynamic from "next/dynamic";
const LottiePlayer = dynamic(
  () => import("@lottiefiles/react-lottie-player").then(mod => mod.Player),
  { ssr: false }
);
import tutelaIcon from '@/public/animated-icons/ley.json';
import abogadoIcon from '@/public/animated-icons/mujer-abogada.json';

const LOTTIE_ICONS = {
  tutela: tutelaIcon,
  abogado: abogadoIcon,
};

type ButtonOption = "tutela" | "abogado";

export function LegalActionSelector({ pqrType, typeLabel, onOptionSelect }: StepProps) {
  const [hoverState, setHoverState] = useState<ButtonOption | null>(null);

  const handleMouseEnter = (option: ButtonOption) => {
    setHoverState(option);
  };

  const handleMouseLeave = () => {
    setHoverState(null);
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Selecciona el tipo de seguimiento que deseas realizar para tu {typeLabel}.
      </p>
      
      <div className="grid grid-cols-1 gap-4">
        {pqrType === "PETITION" || pqrType === "CLAIM" ? (
          <>
            <button
              onClick={() => onOptionSelect?.("tutela")}
              className="flex items-center justify-between p-4 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 transition-colors"
              onMouseEnter={() => handleMouseEnter("tutela")}
              onMouseLeave={handleMouseLeave}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 flex items-center justify-center relative">
                  <LottiePlayer
                    autoplay={false}
                    loop
                    hover
                    src={LOTTIE_ICONS.tutela}
                  />
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-medium">Generar acción de tutela</span>
                  <span className="text-xs text-muted-foreground mt-1">
                    Crea un documento legal para proteger tus derechos fundamentales
                  </span>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-blue-600" />
            </button>
            
            <button
              onClick={() => onOptionSelect?.("abogado")}
              className="flex items-center justify-between p-4 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors"
              onMouseEnter={() => handleMouseEnter("abogado")}
              onMouseLeave={handleMouseLeave}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 flex items-center justify-center relative">
                  <LottiePlayer
                    autoplay={false}
                    loop
                    hover
                    src={LOTTIE_ICONS.abogado}
                  />
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-medium">Contactar abogado</span>
                  <span className="text-xs text-muted-foreground mt-1">
                    Recibe asesoría legal especializada para tu caso
                  </span>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          </>
        ) : (
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center">
                <div className="text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  Para {typeLabel === "queja" ? "quejas" : "denuncias"}, el seguimiento
                  consiste en enviar pruebas adicionales a la entidad correspondiente.
                  Pronto habilitaremos esta funcionalidad.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}