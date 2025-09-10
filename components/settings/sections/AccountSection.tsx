'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useFullUser } from '@/components/UserProvider';
import { useProfileForm, UserProfileUpdateData } from '@/hooks/useProfileForm';
import { ProfilePictureSection } from './ProfilePictureSection';
import { PersonalInfoSection } from './PersonalInfoSection';
import { PasswordChangeSection } from './PasswordChangeSection';
import { DeleteAccountSection } from './DeleteAccountSection';

interface ProfileEditSectionProps {
  onSave?: (data: UserProfileUpdateData) => Promise<boolean>;
}

export function ProfileEditSection({ onSave }: ProfileEditSectionProps) {
  const currentUser = useFullUser();
  const {
    formData,
    imageFile,
    shouldRemoveImage,
    loading,
    updatePersonalInfo,
    updatePassword,
    updateImage,
    submitForm,
  } = useProfileForm({ currentUser, onSave });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitForm();
  };

  if (!currentUser) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">Por favor inicia sesión para editar tu perfil</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Editar Perfil</CardTitle>
          <CardDescription>
            Actualiza tu información personal. Los cambios se verán reflejados en tu perfil.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <ProfilePictureSection
              currentImage={currentUser.image}
              onImageChange={updateImage}
              disabled={loading}
            />

            <PersonalInfoSection
              data={{
                name: formData.name,
                phone: formData.phone,
              }}
              onChange={updatePersonalInfo}
              disabled={loading}
            />

            {!currentUser?.isOAuth && (
              <PasswordChangeSection
                data={{
                  currentPassword: formData.currentPassword,
                  newPassword: formData.newPassword,
                  confirmPassword: formData.confirmPassword,
                }}
                onChange={updatePassword}
                disabled={loading}
              />
            )}

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={loading} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                {loading ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <DeleteAccountSection
        userId={currentUser.id}
        userEmail={currentUser.email || ""}
        disabled={loading}
      />
    </div>
  );
}
