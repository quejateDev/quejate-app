import dynamic from "next/dynamic";
import { ChevronRight } from "lucide-react";

const LottiePlayer = dynamic(
  () => import("@lottiefiles/react-lottie-player").then((mod) => mod.Player),
  { ssr: false }
);

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
  return (
    <button
      onClick={() => onSelect(option)}
      className={`flex items-center justify-between p-4 rounded-lg border ${colorClass}-200 bg-${colorClass}-50 hover:bg-${colorClass}-100 transition-colors ${
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
      <ChevronRight className={`h-5 w-5 text-${colorClass}-600`} />
    </button>
  );
}
