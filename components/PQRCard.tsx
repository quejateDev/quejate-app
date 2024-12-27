"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PQRS } from "@prisma/client";
import { Heart, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { toggleLike } from "@/services/api/pqr.service";
import useAuthStore from "@/store/useAuthStore";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type PQRCardProps = {
  pqr: PQRS & {
    department: {
      name: string;
      entity: {
        name: string;
      };
    };
    creator: {
      firstName: string;
      lastName: string;
    };
    customFieldValues: {
      name: string;
      value: string;
    }[];
    _count?: {
      likes: number;
    };
  };
  initialLiked?: boolean;
};

const statusMap = {
  PENDING: { label: "Pendiente", variant: "default" },
  IN_PROGRESS: { label: "En Proceso", variant: "warning" },
  RESOLVED: { label: "Resuelto", variant: "success" },
  REJECTED: { label: "Rechazado", variant: "destructive" },
} as const;

const typeMap = {
  PETITION: "Petición",
  COMPLAINT: "Queja",
  CLAIM: "Reclamo",
  SUGGESTION: "Sugerencia",
} as const;

const calculateRemainingDays = (createdAt: Date, dueDate: Date) => {
  const now = new Date();
  const due = new Date(dueDate);
  const diffTime = due.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export function PQRCard({ pqr, initialLiked = false }: PQRCardProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(pqr._count?.likes || 0);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuthStore();

  const status = statusMap[pqr.status as keyof typeof statusMap];
  const formattedDate = new Date(pqr.createdAt).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  const remainingDays = calculateRemainingDays(new Date(pqr.createdAt), new Date(pqr.dueDate));
  const isExpired = remainingDays <= 0;
  const isUrgent = remainingDays <= 3 && remainingDays > 0;

  const creatorName = !pqr.anonymous 
    ? `${pqr.creator.firstName} ${pqr.creator.lastName}`
    : "Anónimo";

  const handleLike = async () => {
    if (!user || !user.id) {
      toast({
        title: "Inicia sesión",
        description: "Debes iniciar sesión para dar like",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await toggleLike(pqr.id, user.id);
      setLiked(response.liked);
      setLikeCount(response.likes);
    } catch (error) {
      console.error("Error toggling like:", error);
      toast({
        title: "Error",
        description: "No se pudo procesar tu like",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="space-y-1">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-bold">
              {typeMap[pqr.type as keyof typeof typeMap]}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Por: {creatorName} • {formattedDate}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Para: {pqr.department.entity.name} - {pqr.department.name}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Clock className={cn(
                "h-4 w-4",
                isExpired && "text-red-500",
                isUrgent && "text-yellow-500",
                !isExpired && !isUrgent && "text-green-500"
              )} />
              <span className={cn(
                "text-sm font-medium",
                isExpired && "text-red-500",
                isUrgent && "text-yellow-500",
                !isExpired && !isUrgent && "text-green-500"
              )}>
                {isExpired 
                  ? "Vencido"
                  : `${remainingDays} ${remainingDays === 1 ? 'día' : 'días'} restantes`
                }
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLike}
              disabled={isLoading}
              className={liked ? "text-red-500" : ""}
            >
              <Heart className={liked ? "fill-current" : ""} />
              <span className="ml-2">{likeCount}</span>
            </Button>
            <Badge variant={status.variant as "default" | "warning" | "success" | "destructive"}>
              {status.label}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {pqr.customFieldValues.map((field) => (
          <div key={field.name} className="space-y-1">
            <h4 className="text-sm font-medium">{field.name}</h4>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {field.value || "No especificado"}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
