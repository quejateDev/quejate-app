"use client";

import { FileIcon, ImageIcon } from "lucide-react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";

interface PQRAttachmentsProps {
  attachments: Array<{
    name: string;
    url: string;
    type: string;
  }>;
}

const mediaExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'mov', 'avi', 'wmv', 'flv', 'mkv', 'webm'];

export function PQRAttachments({ attachments }: PQRAttachmentsProps) {
  if (!attachments.length) return null;

  const mediaFiles = attachments.filter(att => 
    mediaExtensions.includes(att.type.toLowerCase())
  );
  const otherFiles = attachments.filter(att => 
    !mediaExtensions.includes(att.type.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Archivos Adjuntos</h3>
      
      {/* Archivos Multimedia */}
      {mediaFiles.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {mediaFiles.map((file) => (
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

      {/* Otros Archivos */}
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
              <FileIcon className="w-4 h-4" />
              {file.name}
            </a>
          ))}
        </div>
      )}
    </div>
  );
} 