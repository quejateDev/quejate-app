"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  Star,
  DollarSign,
  Mail,
  Phone,
  Calendar,
  CheckCircle
} from "lucide-react";
import { LawyerData } from "@/types/lawyer-profile";
import { RatingsModal } from "@/components/modals/RatingsModal";
import { formatDateWithoutTime } from "@/lib/dateUtils";

interface LawyerDetailModalProps {
  lawyer: LawyerData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRequestService: () => void;
}

export function LawyerDetailModal({
  lawyer,
  open,
  onOpenChange,
  onRequestService,
}: LawyerDetailModalProps) {
  const [showRatingsModal, setShowRatingsModal] = useState(false);
  

  const formatCurrency = (amount: number | null) => {
    if (!amount) return "No especificado";
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
    }).format(amount);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-white p-6">
        <DialogHeader>
          <DialogTitle>Perfil del Abogado</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col md:flex-row gap-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-24 w-24 border-2 border-quaternary">
                <AvatarImage 
                  src={lawyer.user.image || undefined} 
                  alt={`${lawyer.user.name}`}
                />
                <AvatarFallback className="text-lg">
                  {lawyer.user.name?.[0]}
                </AvatarFallback>
              </Avatar>
              
              <div className="space-y-1">
                <h3 className="text-xl font-semibold">
                  {lawyer.user.name}
                </h3>
                {lawyer.isVerified ? (
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    Abogado Verificado
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    Abogado en proceso de verificación
                    <CheckCircle className="h-4 w-4 text-yellow-500" />
                  </p>
                )}
                {lawyer.averageRating > 0 && (
                  <div 
                    className="flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => setShowRatingsModal(true)}
                  >
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{lawyer.averageRating.toFixed(1)}</span>
                    <span className="text-sm text-muted-foreground">
                      ({lawyer.ratingCount} {lawyer.ratingCount === 1 ? 'reseña' : 'reseñas'})
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
                Información Profesional
              </h4>
              
              <div className="space-y-2 pb-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Desde el {formatDateWithoutTime(lawyer.createdAt)} en la plataforma</span>
                </div>

                {lawyer.feePerHour && (
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span>{lawyer.feePerHour.toLocaleString()} COP/hora</span>
                  </div>
                )}
              </div>
              {lawyer.description && (
              <>
                <p className="text-sm leading-relaxed text-gray-700">
                    {lawyer.description}
                </p>
              </>
            )}
            </div>
          </div>

          <Separator />

          {lawyer.specialties.filter(s => s.trim() !== "").length >= 1 && (
            <div className="space-y-3 pb-3">
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Especialidades
              </h4>
              <div className="flex flex-wrap gap-2">
                {lawyer.specialties
                  .filter((s) => s.trim() !== "")
                  .map((specialty: string, index: number) => (
                    <Badge key={index} className="text-xs bg-primary text-white">
                      {specialty}
                    </Badge>
                  ))}
              </div>
            </div>
          )}

      </DialogContent>
      
      <RatingsModal
        isOpen={showRatingsModal}
        onClose={() => setShowRatingsModal(false)}
        lawyerUserId={lawyer.user.id}
        lawyerName={`${lawyer.user.name}`}
      />
    </Dialog>
  );
}
