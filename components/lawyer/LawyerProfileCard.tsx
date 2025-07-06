"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  Edit2, 
  Mail, 
  Phone, 
  FileText, 
  Calendar, 
  DollarSign,
  Star,
  CheckCircle
} from "lucide-react";
import { useLawyerProfile, LawyerProfileUpdateData } from "@/hooks/useLawyerProfile";
import { LawyerProfileEditModal } from "@/components/lawyer/LawyerProfileEditModal";

export function LawyerProfileCard() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { 
    lawyerData, 
    loading, 
    error, 
    updateProfile 
  } = useLawyerProfile();

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = async (updatedData: LawyerProfileUpdateData) => {
    const success = await updateProfile(updatedData);
    if (success) {
      setIsEditModalOpen(false);
    }
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-48"></div>
                <div className="h-3 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !lawyerData) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="text-center text-red-500">
            {error || "No se pudo cargar el perfil del abogado"}
          </div>
        </CardContent>
      </Card>
    );
  }

  const { user, specialties, description, experienceYears, feePerHour, averageRating, ratingCount, documentType, identityDocument } = lawyerData;

  return (
    <>
      <Card className="w-full">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <CardTitle className="text-2xl font-bold">Mi Perfil Profesional</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={handleEditClick}
              className="flex items-center gap-2"
            >
              <Edit2 className="h-4 w-4" />
              Editar
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-24 w-24">
                <AvatarImage 
                  src={user.profilePicture || undefined} 
                  alt={`${user.firstName} ${user.lastName}`}
                />
                <AvatarFallback className="text-lg">
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              
              <div className="space-y-1">
                <h3 className="text-xl font-semibold">
                  {user.firstName} {user.lastName}
                </h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  Abogado Verificado
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </p>
                {averageRating > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{averageRating.toFixed(1)}</span>
                    <span className="text-sm text-muted-foreground">
                      ({ratingCount} {ratingCount === 1 ? 'valoración' : 'valoraciones'})
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Información de Contacto
              </h4>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{user.email}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span>{documentType}: {identityDocument}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{user.phone || 'No disponible'}</span>
                </div>
                
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Información Profesional
              </h4>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{experienceYears} {experienceYears === 1 ? 'año' : 'años'} de experiencia</span>
                </div>
                
                {feePerHour && (
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span>${feePerHour.toLocaleString()} COP/hora</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {specialties && specialties.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Especialidades
              </h4>
              <div className="flex flex-wrap gap-2">
                {specialties.map((specialty: string, index: number) => (
                  <Badge key={index} className="text-xs bg-primary text-white">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {description && (
            <>
              <Separator />
              <div className="space-y-3">
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                  Descripción Profesional
                </h4>
                <p className="text-sm leading-relaxed text-gray-700">
                  {description}
                </p>
              </div>
            </>
          )}

        </CardContent>
      </Card>

      <LawyerProfileEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveProfile}
        initialData={lawyerData}
      />
    </>
  );
}
