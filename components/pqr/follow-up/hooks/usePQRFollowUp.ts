import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { PQR } from "@/types/pqrsd";
import { LawyerData } from "@/types/lawyer-profile";
import { typeMap } from "@/constants/pqrMaps";
import { calculateBusinessDaysExceeded } from "@/utils/dateHelpers";
import { OversightEntity, TutelaFormData } from "../types";
import { pqrFollowUpService } from "../services/pqrFollowUpService";
import { formatText } from "@/utils/formatText";

export function usePQRFollowUp(
  pqrType: keyof typeof typeMap,
  pqrData: PQR,
  onOpenChange: (open: boolean) => void
) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [oversightEntity, setOversightEntity] = useState<OversightEntity | null>(null);
  const [oversightEntities, setOversightEntities] = useState<OversightEntity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingEntities, setIsLoadingEntities] = useState(false);
  const [isGeneratingOversightDoc, setIsGeneratingOversightDoc] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hoverState, setHoverState] = useState<string | null>(null);
  const [showTutelaForm, setShowTutelaForm] = useState(false);
  const [showOversightEntityList, setShowOversightEntityList] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDocument, setGeneratedDocument] = useState<string | null>(null);
  const [showDocumentExport, setShowDocumentExport] = useState(false);
  const [showLawyersList, setShowLawyersList] = useState(false);
  const [showLawyerRequestModal, setShowLawyerRequestModal] = useState(false);
  const [selectedLawyer, setSelectedLawyer] = useState<LawyerData | null>(null);

  useEffect(() => {
    if (pqrType === "COMPLAINT" || pqrType === "REPORT") {
      setOversightEntity(null);
      setOversightEntities([]);
      setError(null);
    }
  }, [pqrType]);

  const fetchOversightEntitiesByLocation = async () => {
    try {
      setIsLoadingEntities(true);
      setError(null);

      const entityId = pqrData.entity?.id;
      if (!entityId) {
        setError("No se pudo identificar la entidad");
        return;
      }

      const entityResponse = await fetch(`/api/entities/${entityId}`);
      if (!entityResponse.ok) {
        throw new Error("Error al obtener información de la entidad");
      }

      const entityData = await entityResponse.json();
      
      if (!entityData.regionalDepartmentId) {
        setError("La entidad no tiene departamento asignado");
        return;
      }

      const entities = await pqrFollowUpService.getOversightEntitiesByLocation(
        entityData.regionalDepartmentId,
        entityData.municipalityId || undefined
      );

      setOversightEntities(entities);
      
      if (entities.length === 0) {
        setError("No se encontraron entes de control para esta ubicación");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Error al cargar entes de control");
      setOversightEntities([]);
    } finally {
      setIsLoadingEntities(false);
    }
  };

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);

    if (option === "abogado") {
      setShowLawyersList(true);
      return;
    }

    if (option === "tutela") {
      setShowTutelaForm(true);
      return;
    }

    if (option === "oversight") {
      setShowOversightEntityList(true);
      fetchOversightEntitiesByLocation();
      return;
    }

    onOpenChange(false);
  };

  const handleOversightEntitySelect = (entity: OversightEntity) => {
    setOversightEntity(entity);
    setShowOversightEntityList(false);
    setIsGeneratingOversightDoc(true);
    handleGenerateOversightDocument(entity);
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setSelectedOption(null);
      setShowTutelaForm(false);
      setShowOversightEntityList(false);
      setIsGeneratingOversightDoc(false);
      setShowDocumentExport(false);
      setShowLawyersList(false);
      setGeneratedDocument(null);
      setOversightEntity(null);
      setOversightEntities([]);
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

  const handleGenerateOversightDocument = async (selectedEntity?: OversightEntity) => {
    const entityToUse = selectedEntity || oversightEntity;
    if (!entityToUse) return;

    setIsGenerating(true);
    const loadingToast = toast({
      title: "Generando documento",
      description: "Estamos preparando el documento para el ente de control...",
      variant: "default",
      duration: Infinity,
    });

    try {
      const createdAtDate = new Date(pqrData.createdAt);
      if (isNaN(createdAtDate.getTime())) {
        throw new Error("Fecha de creación inválida");
      }

      const entityId = pqrData.entity?.id;
      if (!entityId) {
        throw new Error("No se pudo identificar la entidad");
      }

      const entityResponse = await fetch(`/api/entities/${entityId}`);
      if (!entityResponse.ok) {
        throw new Error("Error al obtener información de la entidad");
      }

      const entityData = await entityResponse.json();

      const daysExceeded = calculateBusinessDaysExceeded(pqrData.createdAt);
      const documentData = {
        fullName: pqrData.creator
          ? `${pqrData.creator.name}`
          : "Anónimo",
        oversightEntity: entityToUse.name,
        entity: pqrData.entity?.name,
        pqrType: typeMap[pqrType].label,
        pqrDate: createdAtDate.toISOString().split("T")[0],
        daysExceeded: daysExceeded,
        pqrDescription: pqrData.description || "",
        department: formatText(entityData.RegionalDepartment?.name || "No especificado"),
        city: formatText(entityData.Municipality?.name || undefined),
      };

      const document = await pqrFollowUpService.generateOversightDocument(documentData);
      setGeneratedDocument(document);
      setIsGeneratingOversightDoc(false);
      setShowDocumentExport(true);

      toast({
        title: "Documento generado",
        description: "El documento para el ente de control ha sido creado exitosamente",
        variant: "default",
      });
    } catch (error) {
      console.error("Error generating oversight document:", error);
      setIsGeneratingOversightDoc(false);
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

  const handleLawyerSelected = (lawyer: any) => {
    setSelectedLawyer(lawyer);
    setShowLawyersList(false);
    setShowLawyerRequestModal(true);
  };

  return {
    selectedOption,
    oversightEntity,
    oversightEntities,
    isLoading,
    isLoadingEntities,
    isGeneratingOversightDoc,
    error,
    hoverState,
    showTutelaForm,
    showOversightEntityList,
    isGenerating,
    generatedDocument,
    showDocumentExport,
    showLawyersList,
    showLawyerRequestModal,
    selectedLawyer,
    handleOptionSelect,
    handleOversightEntitySelect,
    handleClose,
    handleGenerateDocument,
    handleGenerateOversightDocument,
    handleMouseEnter,
    handleMouseLeave,
    handleLawyerSelected,
    setShowTutelaForm,
    setShowLawyersList,
    setShowOversightEntityList,
    setShowLawyerRequestModal,
  };
}
