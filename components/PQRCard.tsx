"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PQRS } from "@prisma/client";
import { Heart, Paperclip } from "lucide-react";
import { useState } from "react";
import { toggleLike } from "@/services/api/pqr.service";
import useAuthStore from "@/store/useAuthStore";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";

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
  PENDING: {
    label: "Pendiente",
    variant: "pending",
  },
  IN_PROGRESS: {
    label: "En Proceso",
    variant: "in_progress",
  },
  RESOLVED: {
    label: "Resuelto",
    variant: "resolved",
  },
  CLOSED: {
    label: "Cerrado",
    variant: "rejected",
  },
} as const;

const typeMap = {
  PETITION: { label: "Petición", color: "text-blue-600" },
  COMPLAINT: { label: "Queja", color: "text-red-600" },
  CLAIM: { label: "Reclamo", color: "text-orange-600" },
  SUGGESTION: { label: "Sugerencia", color: "text-green-600" },
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
  const status = pqr.status;
  const statusInfo = statusMap[status as keyof typeof statusMap];

  const formattedDate = new Date(pqr.createdAt).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
    // hour: "2-digit",
    // minute: "2-digit",
  });

  const remainingDays = calculateRemainingDays(
    new Date(pqr.createdAt),
    new Date(pqr.dueDate)
  );

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
      setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
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

  const mediaExtensions = [
    "jpg",
    "jpeg",
    "png",
    "gif",
    "webp",
    "mp4",
    "mov",
    "avi",
    "wmv",
    "flv",
    "mkv",
    "webm",
  ];
  const imageAttachments =
    pqr.attachments?.filter((att) =>
      mediaExtensions.includes(att.type.toLowerCase())
    ) || [];
  const otherAttachments =
    pqr.attachments?.filter(
      (att) => !mediaExtensions.includes(att.type.toLowerCase())
    ) || [];

  const getFullUrl = (url: string) => {
    return `${url}`;
  };
  return (
    <div className="md:block">
      <div className="hidden md:block">
        <Card>
          <CardHeader className="pb-6">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-100">
                    <span className="text-md">
                      {creatorName.charAt(0).toUpperCase()}
                    </span>
                </div>
                <div>
                  <p className="text-sm font-semibold">{creatorName}</p>
                  <p className="text-xs text-muted-foreground">
                    {formattedDate} •{" "}
                    <span
                      className={typeMap[pqr.type as keyof typeof typeMap].color}
                    >
                      {typeMap[pqr.type as keyof typeof typeMap].label}
                    </span>
                  </p>
                </div>
              </div>
              <Badge variant={statusInfo.variant as any}>{statusInfo.label}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h1 className="font-semibold text-md">
                  {pqr.customFieldValues.find(
                    (field) => field.name === "Título" || "Titulo")?.value || "No Title"}
                </h1>
                <p className="text-xs text-muted-foreground mb-5">
                  Entidad: {pqr.department.entity.name}
                </p>
                <p className="text-sm">
                  {pqr.customFieldValues.find(
                    (field) => field.name === "Descripción"
                  )?.value || "No Description"}
                </p>
              </div>
  
              {imageAttachments.length > 0 && (
                <Carousel className="w-full max-w-md mx-auto relative">
                  <CarouselContent>
                    {imageAttachments.map((attachment, index) => (
                      <CarouselItem key={attachment.url}>
                        <div className="p-1">
                          <Dialog>
                            <DialogTrigger asChild>
                              <div className="relative cursor-pointer group h-60">
                                {attachment.type.includes("mp4") ? (
                                  <video
                                    src={attachment.url}
                                    className="object-cover w-full h-full"
                                    controls
                                    autoPlay
                                  />
                                ) : (
                                  <Image
                                    src={attachment.url}
                                    alt={attachment.name}
                                    fill
                                    className="object-contain border border-gray-200 rounded-md"
                                  />
                                )}
                              </div>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl">
                              <DialogTitle></DialogTitle>
                              <div className="relative h-[80vh]">
                                {attachment.type.includes("mp4") ? (
                                  <video
                                    src={attachment.url}
                                    className="object-contain"
                                    controls
                                    autoPlay
                                  />
                                ) : (
                                  <Image
                                    src={attachment.url}
                                    alt={attachment.name}
                                    fill
                                    className="object-contain border border-gray-200 rounded-md"
                                  />
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  {imageAttachments.length > 1 && (
                    <div className="hidden md:block">
                      <CarouselPrevious />
                      <CarouselNext />
                    </div>
                  )}
                </Carousel>
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
                  className="gap-2 pl-0 hover:bg-transparent hover:text-current"
                  onClick={handleLike}
                  disabled={isLoading}
                >
                  <Heart
                    className={cn(
                      "w-4 h-4",
                      liked
                        ? "fill-current text-red-500"
                        : "text-gray-500 stroke-red-500"
                    )}
                  />
                  <span>{likeCount}</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
  
      <div className="md:hidden border-b border-gray-300">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100">
              <span className="text-md">
                {creatorName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold">{creatorName}</p>
              <p className="text-xs text-muted-foreground">
                {formattedDate} •{" "}
                <span
                  className={typeMap[pqr.type as keyof typeof typeMap].color}
                >
                  {typeMap[pqr.type as keyof typeof typeMap].label}
                </span>
              </p>
            </div>
          </div>
          <Badge variant={statusInfo.variant as any} className="text-xs">
            {statusInfo.label}
          </Badge>
        </div>
  
        <div className="space-y-3">
          <div>
            <h1 className="font-semibold text-md">
              {pqr.customFieldValues.find(
                (field) => field.name === "Titulo" || "Titulo "
              )?.value || "No Title"}
            </h1>
            <p className="text-xs text-muted-foreground mb-4">
              Entidad: {pqr.department.entity.name}
            </p>
            <p className="text-sm">
              {pqr.customFieldValues.find(
                (field) => field.name === "Descripción"
              )?.value || "No Description"}
            </p>
          </div>
  
          {imageAttachments.length > 0 && (
            <Carousel className="w-full relative">
              <CarouselContent>
                {imageAttachments.map((attachment) => (
                  <CarouselItem key={attachment.url}>
                    <div className="p-1">
                      <Dialog>
                        <DialogTrigger asChild>
                          <div className="relative cursor-pointer group h-48">
                            {attachment.type.includes("mp4") ? (
                              <video
                                src={attachment.url}
                                className="object-cover w-full h-full"
                                controls
                                autoPlay
                              />
                            ) : (
                              <Image
                                src={attachment.url}
                                alt={attachment.name}
                                fill
                                className="object-contain border border-gray-200 rounded-md"
                              />
                            )}
                          </div>
                        </DialogTrigger>
                        <DialogContent className="max-w-full">
                          <DialogTitle></DialogTitle>
                          <div className="relative h-[80vh]">
                            {attachment.type.includes("mp4") ? (
                              <video
                                src={attachment.url}
                                className="object-contain"
                                controls
                                autoPlay
                              />
                            ) : (
                              <Image
                                src={attachment.url}
                                alt={attachment.name}
                                fill
                                className="object-contain border border-gray-200 rounded-md"
                              />
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
  
              {imageAttachments.length > 1 && (
                <div className="flex justify-center mt-2">
                  <CarouselPrevious className="static mr-2 translate-y-0 h-8 w-8" />
                  <CarouselNext className="static ml-2 translate-y-0 h-8 w-8" />
                </div>
              )}
            </Carousel>
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
                  className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded-md hover:bg-secondary/80 transition-colors text-xs"
                >
                  <Paperclip className="w-3 h-3" />
                  {attachment.name}
                </a>
              ))}
            </div>
          )}
  
          <div className="flex justify-between items-center pt-1 pb-3">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 px-0 py-1 h-auto hover:bg-transparent hover:text-current"
              onClick={handleLike}
              disabled={isLoading}
            >
              <Heart
                className={cn(
                  "w-4 h-4",
                  liked
                    ? "fill-current text-red-500"
                    : "text-gray-500 stroke-red-500"
                )}
              />
              <span>{likeCount}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
