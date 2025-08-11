"use client";

import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, User, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { UserWithFollowingStatus } from "@/types/user-with-following";

interface UserProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedData: UserProfileUpdateData) => Promise<boolean>;
  initialData?: UserWithFollowingStatus;
}

export interface UserProfileUpdateData {
  name: string;
  image?: string | null;
  currentPassword?: string;
  newPassword?: string;
}

export function UserProfileEditModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: UserProfileEditModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [image, setProfilePicture] = useState<File | null>(null);
  const [imagePreview, setProfilePicturePreview] = useState<string>("");
  const [shouldRemoveProfilePicture, setShouldRemoveProfilePicture] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (initialData && isOpen) {
      setFormData({
        name: initialData.name || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setProfilePicturePreview(initialData.image || "");
      setProfilePicture(null);
      setShouldRemoveProfilePicture(false);
    }
  }, [initialData, isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePicture(file);
      setProfilePicturePreview(URL.createObjectURL(file));
      setShouldRemoveProfilePicture(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveProfilePicture = () => {
    setProfilePicture(null);
    setProfilePicturePreview("");
    setShouldRemoveProfilePicture(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const uploadProfilePicture = async (): Promise<string | null> => {
    if (!image) return null;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', image);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error al subir la imagen');
      }

      const data = await response.json();
      return data.path || data.url;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "El nombre es requerido",
        variant: "destructive",
      });
      return false;
    }

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden",
        variant: "destructive",
      });
      return false;
    }

    if (formData.newPassword && formData.newPassword.length < 6) {
      toast({
        title: "Error",
        description: "La nueva contraseña debe tener al menos 6 caracteres",
        variant: "destructive",
      });
      return false;
    }

    if (formData.newPassword && !formData.currentPassword) {
      toast({
        title: "Error",
        description: "Debes ingresar tu contraseña actual para cambiarla",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      let imageUrl = initialData?.image;

      if (shouldRemoveProfilePicture) {
        imageUrl = null;
      } else if (image) {
        imageUrl = await uploadProfilePicture();
      }

      const updateData: UserProfileUpdateData = {
        name: formData.name.trim(),
        image: shouldRemoveProfilePicture ? null : (imageUrl || undefined),
        currentPassword: formData.currentPassword.trim() || undefined,
        newPassword: formData.newPassword.trim() || undefined,
      };

      console.log('Sending update data:', updateData);

      const success = await onSave(updateData);
      if (success) {
        handleClose();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al actualizar el perfil",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        name: "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setProfilePicture(null);
      setProfilePicturePreview("");
      setShouldRemoveProfilePicture(false);
      onClose();
    }
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] bg-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Perfil</DialogTitle>
          <DialogDescription>
            Actualiza tu información personal. Los cambios se verán reflejados en tu perfil.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative w-24 h-24 group">
              <Avatar className="w-24 h-24 border-2 border-primary/20">
                <AvatarImage 
                  src={shouldRemoveProfilePicture ? "" : (imagePreview || initialData?.image || "")} 
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
              disabled={loading || isUploading}
            />
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={triggerFileInput}
                disabled={loading || isUploading}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                {imagePreview && !shouldRemoveProfilePicture ? "Cambiar foto" : "Subir foto"}
              </Button>
              {(imagePreview || initialData?.image) && !shouldRemoveProfilePicture && (
                <Button
                  type="button"
                  size="sm"
                  onClick={handleRemoveProfilePicture}
                  disabled={loading || isUploading}
                  className="flex items-center gap-2 bg-red-500 text-white hover:bg-red-600 border-red-200 hover:border-red-300"
                >
                  Eliminar foto
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre completo *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Ingresa tu nombre"
                className="border-muted"
                disabled={loading}
                required
              />
            </div>
          </div>

          {!initialData?.isOAuth &&(
            <div className="space-y-4 border-t pt-4">
            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Cambiar Contraseña
            </h4>
            
            <div className="space-y-2">
              <div className="relative">
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type={showPasswords.current ? "text" : "password"}
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  className="border-muted"
                  placeholder="Ingresa tu contraseña actual"
                  disabled={loading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-auto p-1"
                  onClick={() => togglePasswordVisibility('current')}
                >
                  {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative">
                <Input
                  id="newPassword"
                  name="newPassword"
                  type={showPasswords.new ? "text" : "password"}
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  placeholder="Ingresa tu nueva contraseña"
                  className="border-muted"
                  disabled={loading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-auto p-1"
                  onClick={() => togglePasswordVisibility('new')}
                >
                  {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPasswords.confirm ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirma tu nueva contraseña"
                  className="border-muted"
                  disabled={loading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-auto p-1"
                  onClick={() => togglePasswordVisibility('confirm')}
                >
                  {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || isUploading}>
              {loading ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
