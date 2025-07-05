import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { PQR } from "@/types/pqrsd";
import { typeMap } from "@/constants/pqrMaps";
import { calculateBusinessDaysExceeded } from "@/utils/dateHelpers";
import { OversightEntity, TutelaFormData } from "../types";
import { pqrFollowUpService } from "../services/pqrFollowUpService";

export function usePQRFollowUp(
  pqrType: keyof typeof typeMap,
  pqrData: PQR,
  onOpenChange: (open: boolean) => void
) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [oversightEntity, setOversightEntity] = useState<OversightEntity | null>(null);
  const [isLoading, setIsLoading] = useState(
    pqrType === "COMPLAINT" || pqrType === "REPORT" ? true : false
  );
  const [error, setError] = useState<string | null>(null);
  const [hoverState, setHoverState] = useState<string | null>(null);
  const [showTutelaForm, setShowTutelaForm] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDocument, setGeneratedDocument] = useState<string | null>(null);
  const [showDocumentExport, setShowDocumentExport] = useState(false);

  useEffect(() => {
    const fetchOversightEntity = async () => {
      if (!(pqrType === "COMPLAINT" || pqrType === "REPORT")) return;

      try {
        setIsLoading(true);
        const entityId = pqrData.entity?.id;
        if (!entityId) {
          setError("No se pudo identificar la entidad");
          return;
        }

        const oversightEntity = await pqrFollowUpService.getOversightEntity(entityId);
        setOversightEntity(oversightEntity);
      } catch (error) {
        console.error("Error:", error);
        setError("Error al cargar información del ente de control");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOversightEntity();
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
      const documentData = {
        ...formData,
        pqrType: pqrType,
        pqrDate: createdAtDate.toISOString().split("T")[0],
        daysExceeded: daysExceeded,
      };

      const document = await pqrFollowUpService.generateTutelaDocument(documentData);
      setGeneratedDocument(document);
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
      const documentData = {
        fullName: pqrData.creator
          ? `${pqrData.creator.firstName} ${pqrData.creator.lastName}`
          : "Anónimo",
        oversightEntity: oversightEntity.name,
        entity: pqrData.entity?.name,
        pqrType: typeMap[pqrType].label,
        pqrDate: createdAtDate.toISOString().split("T")[0],
        daysExceeded: daysExceeded,
        pqrDescription: pqrData.description || "",
      };

      const document = await pqrFollowUpService.generateOversightDocument(documentData);
      setGeneratedDocument(document);
      setShowDocumentExport(true);

      toast({
        title: "Documento generado",
        description: "El documento para el ente de control ha sido creado exitosamente",
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

  return {
    selectedOption,
    oversightEntity,
    isLoading,
    error,
    hoverState,
    showTutelaForm,
    isGenerating,
    generatedDocument,
    showDocumentExport,
    handleOptionSelect,
    handleClose,
    handleGenerateDocument,
    handleGenerateOversightDocument,
    handleMouseEnter,
    handleMouseLeave,
    setShowTutelaForm,
  };
}
