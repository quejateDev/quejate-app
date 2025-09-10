'use client';

import React, { useState, useRef } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProfilePictureSectionProps {
  currentImage?: string | null;
  onImageChange: (image: File | null, shouldRemove: boolean) => void;
  disabled?: boolean;
}

export function ProfilePictureSection({ 
  currentImage, 
  onImageChange, 
  disabled = false 
}: ProfilePictureSectionProps) {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(currentImage || "");
  const [shouldRemoveImage, setShouldRemoveImage] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "La imagen debe ser menor a 5MB",
          variant: "destructive",
        });
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Error",
          description: "Solo se permiten archivos de imagen",
          variant: "destructive",
        });
        return;
      }

      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setShouldRemoveImage(false);
      onImageChange(file, false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview("");
    setShouldRemoveImage(true);
    onImageChange(null, true);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative w-24 h-24 group">
        <Avatar className="w-24 h-24 border-2 border-primary/20">
          <AvatarImage 
            src={shouldRemoveImage ? "" : (imagePreview || currentImage || "")} 
            alt="Profile" 
          />
          <AvatarFallback className="bg-muted-foreground/10">
            <User className="h-12 w-12 stroke-1" />
          </AvatarFallback>
        </Avatar>
        <div
          onClick={triggerFileInput}
          className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-200 cursor-pointer rounded-full"
        >
          <div className="text-white flex flex-col items-center space-y-1">
            <Upload className="h-4 w-4" />
            <span className="text-xs font-medium">Cambiar</span>
          </div>
        </div>
        {isUploading && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-full">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-t-transparent border-white"></div>
          </div>
        )}
      </div>
      
      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled || isUploading}
      />
      
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={triggerFileInput}
          disabled={disabled || isUploading}
          className="flex items-center gap-2"
        >
          <Upload className="h-4 w-4" />
          {imagePreview && !shouldRemoveImage ? "Cambiar foto" : "Subir foto"}
        </Button>
        {(imagePreview || currentImage) && !shouldRemoveImage && (
          <Button
            type="button"
            size="sm"
            onClick={handleRemoveImage}
            disabled={disabled || isUploading}
            className="flex items-center gap-2 bg-red-500 text-white hover:bg-red-600 border-red-200 hover:border-red-300"
          >
            Eliminar foto
          </Button>
        )}
      </div>
    </div>
  );
}
