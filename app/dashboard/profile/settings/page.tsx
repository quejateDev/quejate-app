'use client';

import { SettingsLayout } from '@/components/settings/SettingsLayout';
import { 
  ProfileEditSection, 
  PrivacySection,
  TermsSection
} from '@/components/settings/sections';
import { SettingsSectionId } from '@/types/settings';
import { UserProfileUpdateData } from '@/components/forms/UserProfileEdit';
import { useToast } from '@/hooks/use-toast';
import { useFullUser } from '@/components/UserProvider';

export const dynamic = 'force-dynamic';

export default function SettingsPage() {
  const currentUser = useFullUser();
  const { toast } = useToast();

  const handleSaveProfile = async (updateData: UserProfileUpdateData): Promise<boolean> => {
    if (!currentUser?.id) {
      toast({
        title: "Error",
        description: "No se puede actualizar el perfil",
        variant: "destructive",
      });
      return false;
    }

    try {
      const response = await fetch(`/api/users/${currentUser.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log('Error response:', errorData);
        throw new Error(errorData.error || 'Error al actualizar el perfil');
      }

      toast({
        title: 'Éxito',
        description: 'Perfil actualizado correctamente',
      });
      
      window.location.reload();
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error desconocido',
        variant: 'destructive',
      });
      return false;
    }
  };

  const renderSection = (activeSection: SettingsSectionId) => {
    switch (activeSection) {
      case 'profile':
        return <ProfileEditSection onSave={handleSaveProfile} />;
      case 'privacy':
        return <PrivacySection />;
      case 'terms':
        return <TermsSection />;
      default:
        return <ProfileEditSection onSave={handleSaveProfile} />;
    }
  };

  if (!currentUser) {
    return (
      <div className="container mx-auto p-4">
        <p className="text-muted-foreground">Por favor inicia sesión para acceder a la configuración</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 mt-4">
      <SettingsLayout>
        {(activeSection) => renderSection(activeSection)}
      </SettingsLayout>
    </div>
  );
}