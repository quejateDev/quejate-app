"use client";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, User } from "lucide-react";
import Image from "next/image";

interface ProfilePictureUploaderProps {
  image: File | null;
  onFileChange: (file: File | null) => void;
  disabled?: boolean;
  isUploading?: boolean;
}

export function ProfilePictureUploader({
  image,
  onFileChange,
  disabled = false,
  isUploading = false,
}: ProfilePictureUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileChange(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    onFileChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col items-center mb-6">
      <div className="relative w-32 h-32 group mb-4">
        <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20 hover:border-primary/40 transition-colors">
          {image ? (
            <Image
              src={URL.createObjectURL(image)}
              alt="Vista previa de foto de perfil"
              width={128}
              height={128}
              className="w-full h-full object-cover"
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <User className="stroke-1 h-16 w-16 text-primary/60" />
            </div>
          )}

          <div
            onClick={triggerFileInput}
            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-200 cursor-pointer"
          >
            <div className="text-white flex flex-col items-center space-y-1">
              <Upload className="h-6 w-6" />
              <span className="text-xs font-medium">
                {image ? "Cambiar foto" : "Subir foto"}
              </span>
            </div>
          </div>

          {isUploading && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
              <div className="flex flex-col items-center space-y-2 text-white">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-t-transparent border-white"></div>
                <span className="text-xs">Subiendo...</span>
              </div>
            </div>
          )}
        </div>

        <Input
          ref={fileInputRef}
          id="profile-picture"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={disabled || isUploading}
        />
      </div>

      <div className="text-center space-y-1">
        <p className="text-sm text-muted-foreground">
          Foto profesional (recomendado)
        </p>
        {image && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRemoveFile}
            className="text-xs text-red-500 hover:text-red-700 h-auto p-1"
          >
            Remover foto
          </Button>
        )}
      </div>
    </div>
  );
}
