"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Eye, Download } from "lucide-react";

interface Attachment {
  name: string;
  url: string;
  type: string;
  size: number;
}

interface AttachmentViewerProps {
  attachments: Attachment[];
  baseUrl?: string;
}

export function AttachmentViewer({ attachments, baseUrl = process.env.NEXT_PUBLIC_S3_BASE_URL }: AttachmentViewerProps) {
  const [selectedAttachment, setSelectedAttachment] = useState<Attachment | null>(null);

  const isImage = (type: string) => type.startsWith("image/");
  const isPDF = (type: string) => type === "application/pdf";

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFullUrl = (url: string) => {
    return `${baseUrl}/${url}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {attachments.map((attachment) => (
        <Card key={attachment.name} className="overflow-hidden">
          <CardContent className="p-4">
            {isImage(attachment.type) ? (
              <Dialog>
                <DialogTrigger asChild>
                  <div className="relative h-48 cursor-pointer group">
                    <Image
                      src={getFullUrl(attachment.url)}
                      alt={attachment.name}
                      fill
                      className="object-cover rounded-md"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Eye className="w-8 h-8 text-white" />
                    </div>
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
            ) : isPDF(attachment.type) ? (
              <div className="h-48 bg-gray-100 rounded-md flex items-center justify-center">
                <embed
                  src={getFullUrl(attachment.url)}
                  type="application/pdf"
                  width="100%"
                  height="100%"
                  className="rounded-md"
                />
              </div>
            ) : (
              <div className="h-48 bg-gray-100 rounded-md flex items-center justify-center">
                <span className="text-gray-500">Vista previa no disponible</span>
              </div>
            )}
            <div className="mt-4 space-y-2">
              <p className="font-medium truncate" title={attachment.name}>
                {attachment.name}
              </p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{formatFileSize(attachment.size)}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(getFullUrl(attachment.url), "_blank")}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Descargar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
