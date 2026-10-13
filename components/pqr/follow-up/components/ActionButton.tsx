import dynamic from "next/dynamic";
import { ChevronRight } from "lucide-react";

const LottiePlayer = dynamic(
  () => import("@lottiefiles/react-lottie-player").then((mod) => mod.Player),
  { ssr: false }
);

// Tailwind solo genera una clase si la encuentra escrita entera en algún
// fichero. Compuestas con el color (`bg-${colorClass}-50`), las de `blue` y
// `gray` existían porque otros ficheros las usan; las de `purple` no las usaba
// ninguno, y el botón del ente de control salía blanco (R-52).
const colorClasses: Record<string, { button: string; arrow: string }> = {
  blue: { button: "bg-blue-50 hover:bg-blue-100", arrow: "text-blue-600" },
  gray: { button: "bg-gray-50 hover:bg-gray-100", arrow: "text-gray-600" },
  purple: { button: "bg-purple-50 hover:bg-purple-100", arrow: "text-purple-600" },
};

type ActionButtonProps = {
  option: string;
  icon: any;
  title: string;
  description: string;
  colorClass: string;
  disabled?: boolean;
  onSelect: (option: string) => void;
  onMouseEnter: (option: string) => void;
  onMouseLeave: () => void;
};

export function ActionButton({
  option,
  icon,
  title,
  description,
  colorClass,
  disabled = false,
  onSelect,
  onMouseEnter,
  onMouseLeave,
}: ActionButtonProps) {
  const colors = colorClasses[colorClass];

  return (
    <button
      onClick={() => onSelect(option)}
      className={`flex items-center justify-between p-4 rounded-lg border ${colorClass}-200 ${colors?.button ?? ""} transition-colors ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
      onMouseEnter={() => onMouseEnter(option)}
      onMouseLeave={onMouseLeave}
      disabled={disabled}
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 flex items-center justify-center relative">
          <LottiePlayer autoplay={false} loop hover src={icon} />
        </div>
        <div className="flex flex-col text-left">
          <span className="font-medium">{title}</span>
          <span className="text-xs text-muted-foreground mt-1">
            {description}
          </span>
        </div>
      </div>
      <ChevronRight className={`h-5 w-5 ${colors?.arrow ?? ""}`} />
    </button>
  );
}
