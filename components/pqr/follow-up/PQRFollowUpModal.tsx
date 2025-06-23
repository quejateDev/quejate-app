"use client";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { typeMap } from "@/constants/pqrMaps";
import { toast } from "@/hooks/use-toast";
import { PQR } from "@/types/pqrsd";
import dynamic from "next/dynamic";
const LottiePlayer = dynamic(
  () => import("@lottiefiles/react-lottie-player").then((mod) => mod.Player),
  { ssr: false }
);
import tutelaIcon from "@/public/animated-icons/ley.json";
import abogadoIcon from "@/public/animated-icons/mujer-abogada.json";
import enteIcon from "@/public/animated-icons/documentos-legales.json";
import { FileText, ChevronRight, ChevronLeft } from "lucide-react";
import { calculateBusinessDaysExceeded } from "@/utils/dateHelpers";
import { OversightEntity, TutelaFormData } from "./types";
import { TutelaFormGenerator } from "./follow-up-components/TutelaFormGenerator";
import { DocumentExport } from "./follow-up-components/DocumentExport";
import { Button } from "@/components/ui/button";
import { OversightDocumentExport } from "./follow-up-components/OversightDocumentExport";

type PQRFollowUpModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pqrType: keyof typeof typeMap;
  pqrData: PQR;
};

export function PQRFollowUpModal({
  open,
  onOpenChange,
  pqrType,
  pqrData,
}: PQRFollowUpModalProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [oversightEntity, setOversightEntity] =
    useState<OversightEntity | null>(null);

  const [isLoading, setIsLoading] = useState(
    pqrType === "COMPLAINT" || pqrType === "REPORT" ? true : false
  );
  const [error, setError] = useState<string | null>(null);
  const [hoverState, setHoverState] = useState<string | null>(null);
  const [showTutelaForm, setShowTutelaForm] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDocument, setGeneratedDocument] = useState<string | null>(
    null
  );
  const [showDocumentExport, setShowDocumentExport] = useState(false);

  const typeLabel = typeMap[pqrType].label.toLowerCase();

  useEffect(() => {
    const fetchOversightEntity = async () => {
      try {
        setIsLoading(true);
        const entityId = pqrData.entity?.id;
        if (!entityId) {
          setError("No se pudo identificar la entidad");
          return;
        }

        const entityResponse = await fetch(`/api/entities/${entityId}`);
        if (!entityResponse.ok) throw new Error("Error al obtener entidad");

        const entityData = await entityResponse.json();
        const categoryId = entityData.category?.id;
        if (!categoryId) {
          setError("La entidad no tiene categoría asignada");
          return;
        }

        const oversightResponse = await fetch(
          `/api/category/${categoryId}/oversight-entity`
        );
        if (!oversightResponse.ok)
          throw new Error("Error al obtener ente de control");

        const { oversightEntity } = await oversightResponse.json();
        setOversightEntity(oversightEntity);
      } catch (error) {
        console.error("Error:", error);
        setError("Error al cargar información del ente de control");
      } finally {
        setIsLoading(false);
      }
    };

    if (pqrType === "COMPLAINT" || pqrType === "REPORT") {
      fetchOversightEntity();
    }
  }, [pqrType, pqrData.entity?.id]);

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);

    if (option === "abogado") {
      toast({
        title: "Información",
        description: "No hay abogados disponibles en este momento",
        variant: "default",
      });
      return;
    }

    if (option === "tutela") {
      setShowTutelaForm(true);
      return;
    }

    if (option === "oversight") {
      handleGenerateOversightDocument();
      return;
    }

    onOpenChange(false);
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setSelectedOption(null);
      setShowTutelaForm(false);
      setShowDocumentExport(false);
      setGeneratedDocument(null);
      setOversightEntity(null);
      setError(null);
    }, 300);
  };

  const handleGenerateDocument = async (formData: TutelaFormData) => {
    setIsGenerating(true);
    const loadingToast = toast({
      title: "Generando documento",
      description: "Estamos preparando tu acción de tutela...",
      variant: "default",
      duration: Infinity,
    });
    try {
      const createdAtDate = new Date(pqrData.createdAt);
      if (isNaN(createdAtDate.getTime())) {
        throw new Error("Fecha de creación inválida");
      }

      const daysExceeded = calculateBusinessDaysExceeded(pqrData.createdAt);
      const response = await fetch("/api/legal-docs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          pqrType: pqrType,
          pqrDate: createdAtDate.toISOString().split("T")[0],
          daysExceeded: daysExceeded,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al generar el documento");
      }

      const data = await response.json();
      setGeneratedDocument(data.tutela);
      setShowTutelaForm(false);
      setShowDocumentExport(true);

      toast({
        title: "Documento generado",
        description: "La acción de tutela ha sido creada exitosamente",
        variant: "default",
      });
    } catch (error) {
      console.error("Error generating document:", error);
      toast({
        title: "Error",
        description: "Hubo un problema al generar el documento",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateOversightDocument = async () => {
    if (!oversightEntity) return;

    setIsGenerating(true);
    const loadingToast = toast({
      title: "Generando documento",
      description: "Estamos preparando el documento...",
      variant: "default",
      duration: Infinity,
    });
    try {
      const createdAtDate = new Date(pqrData.createdAt);
      if (isNaN(createdAtDate.getTime())) {
        throw new Error("Fecha de creación inválida");
      }

      const daysExceeded = calculateBusinessDaysExceeded(pqrData.createdAt);
      const response = await fetch("/api/legal-docs/oversight", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: pqrData.creator
            ? `${pqrData.creator.firstName} ${pqrData.creator.lastName}`
            : "Anónimo",
          oversightEntity: oversightEntity.name,
          entity: pqrData.entity?.name,
          pqrType: typeMap[pqrType].label,
          pqrDate: createdAtDate.toISOString().split("T")[0],
          daysExceeded: daysExceeded,
          pqrDescription: pqrData.description || "",
        }),
      });

      if (!response.ok) {
        throw new Error("Error al generar el documento");
      }

      const data = await response.json();
      setGeneratedDocument(data.document);
      setShowDocumentExport(true);

      toast({
        title: "Documento generado",
        description:
          "El documento para el ente de control ha sido creado exitosamente",
        variant: "default",
      });
    } catch (error) {
      console.error("Error generating oversight document:", error);
      toast({
        title: "Error",
        description: "Hubo un problema al generar el documento",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleMouseEnter = (option: string) => setHoverState(option);
  const handleMouseLeave = () => setHoverState(null);

  const ActionButton = ({
    option,
    icon,
    title,
    description,
    colorClass,
    disabled = false,
  }: {
    option: string;
    icon: any;
    title: string;
    description: string;
    colorClass: string;
    disabled?: boolean;
  }) => (
    <button
      onClick={() => handleOptionSelect(option)}
      className={`flex items-center justify-between p-4 rounded-lg border ${colorClass}-200 bg-${colorClass}-50 hover:bg-${colorClass}-100 transition-colors`}
      onMouseEnter={() => handleMouseEnter(option)}
      onMouseLeave={handleMouseLeave}
      disabled={disabled}
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 flex items-center justify-center relative">
          <LottiePlayer autoplay={false} loop hover src={icon} />
        </div>
        <div className="flex flex-col text-left">
          <span className="font-medium">{title}</span>
          <span className="text-xs text-muted-foreground mt-1">
            {description}
          </span>
        </div>
      </div>
      <ChevronRight className={`h-5 w-5 text-${colorClass}-600`} />
    </button>
  );

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className={`
        ${showDocumentExport && generatedDocument ? "sm:max-w-3xl p-0 overflow-hidden flex flex-col max-h-[90vh] h-[90vh]" : ""}
        ${showTutelaForm ? "sm:max-w-xl" : ""}
        ${!showDocumentExport && !showTutelaForm ? "sm:max-w-md" : ""}
      `}
      >
        {showDocumentExport && generatedDocument ? (
          selectedOption === "oversight" ? (
            <OversightDocumentExport
              generatedDocument={generatedDocument}
              onClose={handleClose}
              pqrData={pqrData}
              oversightEntity={oversightEntity}
            />
          ) : (
            <DocumentExport
              generatedDocument={generatedDocument}
              onClose={handleClose}
              pqrData={pqrData}
            />
          )
        ) : showTutelaForm ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Generar acción de tutela
              </DialogTitle>
            </DialogHeader>
            <TutelaFormGenerator
              onGenerateDocument={handleGenerateDocument}
              isGenerating={isLoading}
              onClose={() => setShowTutelaForm(false)}
              pqrData={pqrData}
            />
            <DialogFooter className="sm:justify-start">
              <Button
                variant="outline"
                onClick={() => setShowTutelaForm(false)}
                disabled={isLoading}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Opciones de seguimiento
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              <p className="text-sm text-muted-foreground">
                Selecciona el tipo de seguimiento que deseas realizar para tu{" "}
                {typeLabel}.
              </p>

              <div className="grid grid-cols-1 gap-4">
                {(pqrType === "PETITION" || pqrType === "CLAIM") && (
                  <>
                    <ActionButton
                      option="tutela"
                      icon={tutelaIcon}
                      title="Generar acción de tutela"
                      description="Crea un documento legal para proteger tus derechos fundamentales"
                      colorClass="blue"
                    />
                    <ActionButton
                      option="abogado"
                      icon={abogadoIcon}
                      title="Contactar abogado"
                      description="Recibe asesoría legal especializada para tu caso"
                      colorClass="gray"
                    />
                  </>
                )}

                {(pqrType === "COMPLAINT" || pqrType === "REPORT") && (
                  <>
                    <ActionButton
                      option="oversight"
                      icon={enteIcon}
                      title="Enviar a ente de control"
                      description={
                        error
                          ? error
                          : oversightEntity
                            ? `Presentar pruebas ante ${oversightEntity.name}`
                            : "No se encontró un ente de control"
                      }
                      colorClass="purple"
                      disabled={!!error || !oversightEntity}
                    />
                    <ActionButton
                      option="abogado"
                      icon={abogadoIcon}
                      title="Contactar abogado"
                      description="Recibe asesoría legal especializada para tu caso"
                      colorClass="gray"
                    />
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
