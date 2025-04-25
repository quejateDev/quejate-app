import { Badge } from "@/components/ui/badge";
import { typeMap, statusMap } from "../../../constants/pqrMaps";
import { AlertTriangle, User } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { calculateBusinessDaysExceeded } from "@/utils/dateHelpers";
import { PQRAlertModal } from "./PQRAlertModal";
import { toast } from "@/hooks/use-toast";

type PQRCardHeaderProps = {
  pqr: {
    id: string;
    creator: {
      firstName: string;
      lastName: string;
      profilePicture?: string | null;
    } | null;
    anonymous: boolean;
    createdAt: Date;
    type: keyof typeof typeMap;
    status: keyof typeof statusMap;
  };
  isUserProfile: boolean;
};

export function PQRCardHeader({ pqr, isUserProfile }: PQRCardHeaderProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showAlert = isUserProfile && 
                   calculateBusinessDaysExceeded(pqr.createdAt) > 0 && 
                   pqr.status !== "RESOLVED";

  const daysExceeded = calculateBusinessDaysExceeded(pqr.createdAt);

  const handleResolved = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/pqr/${pqr.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status: 'RESOLVED' })
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || 'Error al actualizar el estado');
      }
  
      toast({
        title: 'Éxito',
        description: data.message || 'PQRSD marcada como resuelta',
      });
      setIsModalOpen(false);
  
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error desconocido',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleFollowUp = () => {
    setIsModalOpen(false);
  };

  const creatorName = !pqr.anonymous && pqr.creator
    ? `${pqr.creator.firstName} ${pqr.creator.lastName}`
    : "Anónimo";

  const formattedDate = new Date(pqr.createdAt).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const statusInfo = statusMap[pqr.status];
  const typeInfo = typeMap[pqr.type];

  return (
    <>
      <div className="hidden md:block">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-100">
              {pqr.anonymous ? (
                <User className="h-6 w-6 stroke-1" />
              ) : pqr.creator?.profilePicture ? (
                <Image
                  src={pqr.creator.profilePicture}
                  alt={creatorName}
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
              ) : (
                <span className="text-md">
                  {creatorName.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <p className="text-sm font-semibold">{creatorName}</p>
              <p className="text-xs text-muted-foreground">
                {formattedDate} •{" "}
                <span className={typeInfo.color}>{typeInfo.label}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={statusInfo.variant as any}>{statusInfo.label}</Badge>
            {showAlert && (
              <div className="relative group">
                <AlertTriangle 
                  className="h-5 w-5 text-amber-500 cursor-pointer hover:text-amber-600 transition-colors animate-pulse"
                  onClick={() => setIsModalOpen(true)}
                />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                <div className="hidden group-hover:block absolute right-0 top-full mt-1 bg-gray-800 text-white text-xs rounded p-2 whitespace-nowrap z-10 shadow-lg">
                  Tiempo excedido de respuesta: {daysExceeded}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="md:hidden">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100">
              {pqr.anonymous ? (
                <User className="h-6 w-6 stroke-1" />
              ) : (
                <span className="text-md">
                  {creatorName.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <p className="text-sm font-semibold">{creatorName}</p>
              <p className="text-xs text-muted-foreground">
                {formattedDate} •{" "}
                <span className={typeInfo.color}>{typeInfo.label}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={statusInfo.variant as any}>{statusInfo.label}</Badge>
          </div>
        </div>
      </div>

      {showAlert && (
        <PQRAlertModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          daysExceeded={daysExceeded}
          onResolved={handleResolved}
          onFollowUp={handleFollowUp}
          pqrType={pqr.type}
        />
      )}
    </>
  );
}