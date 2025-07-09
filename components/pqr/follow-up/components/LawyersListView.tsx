"use client";

import { useState } from "react";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Star,
  ArrowLeft,
  Eye,
  MessageSquare,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { LawyerData } from "@/types/lawyer-profile";
import { PQR } from "@/types/pqrsd";
import { useLawyersList } from "../hooks/useLawyersList";
import { LawyerDetailModal } from "./LawyerDetailModal";
import { LawyerRequestModal } from "./LawyerRequestModal";

interface LawyersListViewProps {
  pqrData: PQR;
  onBack: () => void;
}

export function LawyersListView({ pqrData, onBack }: LawyersListViewProps) {
  const { lawyers, isLoading, error, sendLawyerRequest } = useLawyersList();
  const [selectedLawyer, setSelectedLawyer] = useState<LawyerData | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const lawyerCount = lawyers.filter(
    (lawyer) => lawyer.user.id !== pqrData.creator?.id
  ).length;

  const handleViewDetail = (lawyer: LawyerData) => {
    setSelectedLawyer(lawyer);
    setShowDetailModal(true);
  };

  const handleRequestService = (lawyer: LawyerData) => {
    setSelectedLawyer(lawyer);
    setShowRequestModal(true);
  };

  const handleDetailModalRequestService = () => {
    setShowDetailModal(false);
    setShowRequestModal(true);
  };

  const handleSubmitRequest = async (
    lawyerId: string,
    message: string,
    clientContactEmail?: string,
    clientContactPhone?: string,
    pqrId?: string
  ) => {
    setIsSubmittingRequest(true);
    const success = await sendLawyerRequest(lawyerId, message, clientContactEmail, clientContactPhone, pqrId);
    setIsSubmittingRequest(false);
    return success;
  };

  const closeModals = () => {
    setShowDetailModal(false);
    setShowRequestModal(false);
    setSelectedLawyer(null);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <DialogHeader className="mb-6">
          <DialogTitle className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="mr-2 p-0 h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            Abogados Disponibles
          </DialogTitle>
        </DialogHeader>

        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin text-quaternary" />
            <span className="text-gray-600">Cargando abogados...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <DialogHeader className="mb-6">
          <DialogTitle className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="mr-2 p-0 h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            Abogados Disponibles
          </DialogTitle>
        </DialogHeader>

        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-3">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
            <h3 className="text-lg font-medium text-gray-900">
              Error al cargar
            </h3>
            <p className="text-gray-600">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="mt-4"
            >
              Intentar de nuevo
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (lawyerCount === 0) {
    return (
      <div className="p-6">
        <DialogHeader className="mb-6">
          <DialogTitle className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="mr-2 p-0 h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            Abogados Disponibles
          </DialogTitle>
        </DialogHeader>

        <div className="text-center py-12">
          <div className="space-y-3">
            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center">
              <MessageSquare className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              No hay abogados disponibles
            </h3>
            <p className="text-gray-600">
              En este momento no hay abogados registrados en la plataforma.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-6">
        <DialogHeader className="mb-6">
          <DialogTitle className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="mr-2 p-0 h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            Abogados Disponibles ({lawyerCount})
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {lawyers
            .filter((lawyer) => lawyer.user.id !== pqrData.creator?.id)
            .map((lawyer) => (
              <Card
                key={lawyer.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <Avatar className="w-12 h-12 flex-shrink-0">
                      <AvatarImage src={lawyer.user.profilePicture || ""} />
                      <AvatarFallback className="text-sm font-semibold">
                        {getInitials(
                          lawyer.user.firstName,
                          lawyer.user.lastName
                        )}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className=" flex items-center space-x-2">
                            <h3 className="font-medium text-gray-900">
                              {lawyer.user.firstName} {lawyer.user.lastName} -
                            </h3>
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="ml-1 text-sm font-medium">
                              {lawyer.averageRating > 0
                                ? lawyer.averageRating.toFixed(1)
                                : "Sin calificaciones"}
                            </span>
                          </div>

                          <p className="text-sm text-gray-600">
                            {lawyer.experienceYears} año
                            {lawyer.experienceYears !== 1 ? "s" : ""} de
                            experiencia
                          </p>
                        </div>
                      </div>
                              
                      {lawyer.specialties && lawyer.specialties.length > 1 && (
                        <div className="mt-2 mb-4">
                          <div className="flex flex-wrap gap-1">
                            {lawyer.specialties
                              .slice(0, 3)
                              .map((specialty, index) => (
                                <Badge
                                  key={index}
                                  className="text-xs bg-primary text-white"
                                >
                                  {specialty}
                                </Badge>
                              ))}
                            {lawyer.specialties.length > 3 && (
                              <Badge className="text-xs bg-primary text-white">
                                +{lawyer.specialties.length - 3} más
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="flex space-x-2 pt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetail(lawyer)}
                          className="flex-1"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Ver Detalle
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleRequestService(lawyer)}
                          className="flex-1 bg-quaternary"
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Solicitar
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>

      {selectedLawyer && (
        <>
          <LawyerDetailModal
            lawyer={selectedLawyer}
            open={showDetailModal}
            onOpenChange={setShowDetailModal}
            onRequestService={handleDetailModalRequestService}
          />

          <LawyerRequestModal
            lawyer={selectedLawyer}
            pqrData={pqrData}
            open={showRequestModal}
            onOpenChange={setShowRequestModal}
            onSubmitRequest={handleSubmitRequest}
            isLoading={isSubmittingRequest}
          />
        </>
      )}
    </>
  );
}
