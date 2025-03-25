'use client';

import { cn } from "@/lib/utils";
import { BadgeCheck } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

interface VerificationBadgeProps {
  className?: string;
  size?: number;
  type?: 'entity' | 'user';
}

export function VerificationBadge({
  className,
  size = 22,
  type = 'entity'
}: VerificationBadgeProps) {
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-flex">
            <BadgeCheck
              className={cn(
                "text-blue-500",
                "drop-shadow-[0_0_1px_rgba(59,130,246,0.4)]",
                "transition-colors duration-200",
                "hover:text-blue-600",
                className
              )}
              size={size}
              strokeWidth={2.5}
            />
          </div>
        </TooltipTrigger>
        <TooltipContent 
          side="top" 
          className="bg-zinc-900 text-white border-zinc-800"
        >
          <div className="flex flex-col gap-1 p-1">
            <p className="font-medium">
              {type === 'entity' ? 'Entidad Verificada' : 'Usuario Verificado'}
            </p>
            <p className="text-xs text-zinc-400 max-w-[200px]">
              {type === 'entity'
                ? 'Esta entidad ha sido verificada por nuestro equipo y cuenta con administradores autorizados.'
                : 'Este usuario ha sido verificado por nuestro equipo y pertenece oficialmente a la entidad.'}
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
} 