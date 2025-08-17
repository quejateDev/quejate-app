import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, User, Eye, EyeOff } from "lucide-react";
import { typeMap, statusMap } from "../../constants/pqrMaps";
import Image from "next/image";
import { useState } from "react";
import { calculateBusinessDaysExceeded } from "@/utils/dateHelpers";
import { PQRAlertModal } from "./PQRAlertModal";
import { toast } from "@/hooks/use-toast";
import { PQR } from "@/types/pqrsd";
import { AvatarFallback, Avatar, AvatarImage } from "../ui/avatar";
import { formatDateWithoutTime } from "@/lib/dateUtils";

type PQRCardHeaderProps = {
  pqr: PQR;
  isUserProfile: boolean;
};

export function PQRCardHeader({ pqr, isUserProfile }: PQRCardHeaderProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPrivate, setIsPrivate] = useState(pqr.private);

  const showAlert =
    isUserProfile &&
    pqr.type !== "SUGGESTION" &&
    new Date(pqr.dueDate).getTime() < new Date().getTime() &&
    pqr.status !== "RESOLVED" &&
    pqr.status !== "CLOSED";

  const daysExceeded = calculateBusinessDaysExceeded(pqr.dueDate);

  const handleResolved = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/pqr/${pqr.id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ status: "RESOLVED" }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al actualizar el estado");
      }

      toast({
        title: "Éxito",
        description: data.message || "PQRSD marcada como resuelta",
      });
      setIsModalOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Error desconocido",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleFollowUp = () => {
    setIsModalOpen(false);
  };

  const handlePrivacyToggle = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/pqr/${pqr.id}/privacy`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ private: !isPrivate }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al actualizar la privacidad");
      }

      setIsPrivate(!isPrivate);
      toast({
        title: "Éxito",
        description: `PQRSD marcada como ${!isPrivate ? "privada" : "pública"}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Error desconocido",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const creatorName =
    !pqr.anonymous && pqr.creator ? `${pqr.creator.name}` : "Anónimo";

  const formattedDate = formatDateWithoutTime(pqr.createdAt);

  const statusInfo = statusMap[pqr.status];
  const typeInfo = typeMap[pqr.type];

  return (
    <>
      <div className="hidden md:block">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-quaternary">
              {pqr.anonymous || !pqr.creator?.image ? (
                <AvatarFallback className="bg-muted-foreground/10 text-quaternary">
                  {pqr.creator?.name && !pqr.anonymous ? (
                    pqr.creator.name.charAt(0).toUpperCase()
                  ) : (
                    <User className="h-5 w-5 stroke-1 text-quaternary" />
                  )}
                </AvatarFallback>
              ) : (
                <AvatarImage src={pqr.creator.image} alt={creatorName} />
              )}
            </Avatar>
            <div>
              <p className="text-sm font-semibold">{creatorName}</p>
              <p className="text-xs text-muted-foreground">
                {formattedDate} •{" "}
                <span className={typeInfo.color}>{typeInfo.label}</span>
              </p>
            </div>
          </div>

          {isUserProfile && (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePrivacyToggle}
                disabled={isUpdating}
                className="h-8 px-2 text-xs hover:bg-muted"
              >
                {isPrivate ? (
                  <>
                    <EyeOff className="h-4 w-4 mr-1" />
                    Privada
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-1" />
                    Pública
                  </>
                )}
              </Button>
              <Badge variant={statusInfo.variant as any}>
                {statusInfo.label}
              </Badge>
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
                    Días excedidos de respuesta: {daysExceeded}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="md:hidden">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 border border-tertiary">
              {pqr.anonymous || !pqr.creator?.image ? (
                <AvatarFallback className="bg-gray-100 dark:bg-gray-700">
                  {!pqr.anonymous && pqr.creator?.name ? (
                    <span className="text-sm font-medium">
                      {pqr.creator.name.charAt(0).toUpperCase()}
                    </span>
                  ) : (
                    <User className="h-4 w-4 stroke-1 text-tertiary" />
                  )}
                </AvatarFallback>
              ) : (
                <AvatarImage
                  src={pqr.creator.image}
                  alt={creatorName}
                  className="h-full w-full"
                />
              )}
            </Avatar>
            <div>
              <p className="text-sm font-semibold">{creatorName}</p>
              <p className="text-xs text-muted-foreground">
                {formattedDate} •{" "}
                <span className={typeInfo.color}>{typeInfo.label}</span>
              </p>
            </div>
          </div>
          {isUserProfile && (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePrivacyToggle}
                disabled={isUpdating}
                className="h-7 px-2 text-xs hover:bg-muted"
              >
                {isPrivate ? (
                  <>
                    <EyeOff className="h-3 w-3 mr-1" />
                    <span className="hidden xs:inline">Privada</span>
                  </>
                ) : (
                  <>
                    <Eye className="h-3 w-3 mr-1" />
                    <span className="hidden xs:inline">Pública</span>
                  </>
                )}
              </Button>
              <Badge variant={statusInfo.variant as any}>
                {statusInfo.label}
              </Badge>
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
          )}
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
          pqr={pqr}
        />
      )}
    </>
  );
}
