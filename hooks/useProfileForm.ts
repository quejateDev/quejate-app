import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { UserWithFollowingStatus } from "@/types/user-with-following";

export interface UserProfileUpdateData {
  name: string;
  phone?: string | null;
  image?: string | null;
  currentPassword?: string;
  newPassword?: string;
}

interface ProfileFormData {
  name: string;
  phone: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface UseProfileFormProps {
  currentUser?: UserWithFollowingStatus | null;
  onSave?: (data: UserProfileUpdateData) => Promise<boolean>;
}

export function useProfileForm({ currentUser, onSave }: UseProfileFormProps) {
  const [formData, setFormData] = useState<ProfileFormData>({
    name: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [shouldRemoveImage, setShouldRemoveImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || "",
        phone: currentUser.phone || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setImageFile(null);
      setShouldRemoveImage(false);
    }
  }, [currentUser]);

  const updatePersonalInfo = (field: 'name' | 'phone', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updatePassword = (field: 'currentPassword' | 'newPassword' | 'confirmPassword', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateImage = (image: File | null, shouldRemove: boolean) => {
    setImageFile(image);
    setShouldRemoveImage(shouldRemove);
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

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return null;

    try {
      const formData = new FormData();
      formData.append('file', imageFile);

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
    }
  };

  const submitForm = async (): Promise<boolean> => {
    if (!validateForm()) return false;

    setLoading(true);

    try {
      let imageUrl = currentUser?.image;

      if (shouldRemoveImage) {
        imageUrl = null;
      } else if (imageFile) {
        imageUrl = await uploadImage();
      }

      const updateData: UserProfileUpdateData = {
        name: formData.name.trim(),
        phone: formData.phone.trim() || null,
        image: shouldRemoveImage ? null : (imageUrl || undefined),
        currentPassword: formData.currentPassword.trim() || undefined,
        newPassword: formData.newPassword.trim() || undefined,
      };

      let success = false;
      
      if (onSave) {
        success = await onSave(updateData);
      } else if (currentUser) {
        const response = await fetch(`/api/users/${currentUser.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Error al actualizar el perfil');
        }

        success = true;
        toast({
          title: 'Éxito',
          description: 'Perfil actualizado correctamente',
        });
        
        setFormData(prev => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
        
        window.location.reload();
      }
      
      return success;
      
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Error desconocido',
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    imageFile,
    shouldRemoveImage,
    loading,
    updatePersonalInfo,
    updatePassword,
    updateImage,
    submitForm,
    validateForm,
  };
}
