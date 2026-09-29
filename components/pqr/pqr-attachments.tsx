"use client";

import { Paperclip } from "lucide-react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog";
import { isImageAttachment, isVideoAttachment } from "./PQRCardAttachments";

interface PQRAttachmentsProps {
  attachments: Array<{
    name: string;
    url: string;
    type: string;
    thumbnailUrl?: string | null;
  }>;
}

export function PQRAttachments({ attachments }: PQRAttachmentsProps) {
  if (!attachments.length) return null;

  // Se decide igual que en el muro (`PQRCardAttachments`): por el MIME que
  // guarda la móvil ("image/jpeg"), por la extensión que guarda la web ("jpg",
  // sacada de la URL en `usePQRForm`), o por el nombre del fichero. Aquí solo
  // se miraba la extensión, así que una foto radicada desde el teléfono salía
  // como un clip sin nombre, y cualquier vídeo acababa dentro de una etiqueta
  // de imagen.
  const images = attachments.filter(isImageAttachment);
  const videos = attachments.filter(
    (att) => !isImageAttachment(att) && isVideoAttachment(att)
  );
  const otherFiles = attachments.filter(
    (att) => !isImageAttachment(att) && !isVideoAttachment(att)
  );

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Archivos Adjuntos</h3>

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((file) => (
            <Dialog key={file.url}>
              <DialogTrigger asChild>
                <div className="relative aspect-video cursor-pointer group">
                  <Image
                    src={file.url}
                    alt={file.name}
                    fill
                    className="object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogTitle className="sr-only">{file.name}</DialogTitle>
                <div className="relative h-[80vh]">
                  <Image
                    src={file.url}
                    alt={file.name}
                    fill
                    className="object-contain"
                  />
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      )}

      {videos.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {videos.map((file) => (
            <video
              key={file.url}
              src={file.url}
              poster={file.thumbnailUrl ?? undefined}
              controls
              preload="metadata"
              className="w-full rounded-lg bg-black"
            />
          ))}
        </div>
      )}

      {otherFiles.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {otherFiles.map((file) => (
            <a
              key={file.url}
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-muted rounded-md hover:bg-secondary/80 transition-colors text-sm"
            >
              <Paperclip className="w-4 h-4 no-hover" />
              <span className="break-all">{file.name}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
