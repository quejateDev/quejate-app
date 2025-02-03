"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PQRS } from "@prisma/client";
import { Heart, Clock, Paperclip } from "lucide-react";
import { useState } from "react";
import { toggleLike } from "@/services/api/pqr.service";
import useAuthStore from "@/store/useAuthStore";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Image from "next/image";

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
    attachments: {
      name: string;
      url: string;
      type: string;
      size: number;
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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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
        title: "Error",
        description: "Debes iniciar sesión para dar like",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      await toggleLike(pqr.id, user.id);
      setLiked(!liked);
      setLikeCount(prev => liked ? prev - 1 : prev + 1);
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

  const mediaExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'mov', 'avi', 'wmv', 'flv', 'mkv', 'webm'];
  const imageAttachments = pqr.attachments?.filter(att => 
    mediaExtensions.includes(att.type.toLowerCase())
  ) || [];
  const otherAttachments = pqr.attachments?.filter(att => 
    !mediaExtensions.includes(att.type.toLowerCase())
  ) || [];

  const getFullUrl = (url: string) => {
    return `${url}`;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-bold">
              {typeMap[pqr.type as keyof typeof typeMap]}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Por {creatorName}
            </p>
          </div>
          <Badge variant={status.variant as any}>
            {status.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">
              {pqr.department.entity.name} - {pqr.department.name}
            </p>
            <p className="text-sm text-muted-foreground">
              {formattedDate}
            </p>
          </div>

          {/* Custom Fields */}
          {pqr.customFieldValues.length > 0 && (
            <div className="space-y-2">
              {pqr.customFieldValues.map((field) => (
                <p key={field.name} className="text-sm">
                  <span className="font-medium">{field.name}:</span> {field.value}
                </p>
              ))}
            </div>
          )}

          {/* Image Attachments - Instagram/Facebook Style */}
          {imageAttachments.length > 0 && (
            <div className={cn(
              "grid gap-1 -mx-6",
              imageAttachments.length === 1 && "grid-cols-1",
              imageAttachments.length === 2 && "grid-cols-2",
              imageAttachments.length >= 3 && "grid-cols-3",
              imageAttachments.length === 4 && "grid-cols-2 grid-rows-2"
            )}>
              {imageAttachments.slice(0, 4).map((attachment, index) => (
                <Dialog key={attachment.url}>
                  <DialogTrigger asChild>
                    <div className={cn(
                      "relative cursor-pointer group",
                      imageAttachments.length === 1 ? "h-96" : "h-48",
                      imageAttachments.length === 4 && index === 0 && "col-span-2 row-span-2"
                    )}>
                      <Image
                        src={getFullUrl(attachment.url)}
                        alt={attachment.name}
                        fill
                        className="object-cover"
                      />
                      {index === 3 && imageAttachments.length > 4 && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <span className="text-white text-xl font-medium">
                            +{imageAttachments.length - 4}
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <div className="relative h-[80vh]">
                      <Image
                        src={getFullUrl(attachment.url)}
                        alt={attachment.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          )}

          {/* Other Attachments */}
          {otherAttachments.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {otherAttachments.map((attachment) => (
                <a
                  key={attachment.url}
                  href={getFullUrl(attachment.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-muted rounded-md hover:bg-secondary/80 transition-colors text-sm"
                >
                  <Paperclip className="w-4 h-4" />
                  {attachment.name}
                </a>
              ))}
            </div>
          )}

          <div className="flex justify-between items-center">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2"
              onClick={handleLike}
              disabled={isLoading}
            >
              <Heart
                className={cn(
                  "w-4 h-4",
                  liked ? "fill-current text-red-500" : "text-gray-500"
                )}
              />
              <span>{likeCount}</span>
            </Button>

            <div className="flex items-center gap-2">
              <Clock className={cn(
                "w-4 h-4",
                isExpired ? "text-red-500" : isUrgent ? "text-yellow-500" : "text-green-500"
              )} />
              <span className={cn(
                "text-sm",
                isExpired ? "text-red-500" : isUrgent ? "text-yellow-500" : "text-green-500"
              )}>
                {isExpired
                  ? "Vencido"
                  : isUrgent
                    ? `${remainingDays} días restantes`
                    : `${remainingDays} días restantes`}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
