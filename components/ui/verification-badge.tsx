'use client';

import { cn } from "@/lib/utils";
import { CheckCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";

interface VerificationBadgeProps {
  className?: string;
  size?: number;
}

export function VerificationBadge({ className, size = 16 }: VerificationBadgeProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <CheckCircle
            className={cn(
              "text-blue-500 fill-blue-500",
              className
            )}
            size={size}
          />
        </TooltipTrigger>
        <TooltipContent>
          <p>Entidad verificada</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
} 