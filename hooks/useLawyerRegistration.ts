"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { DocumentType, DocumentTypeMapping } from "@/types/document-types";

export interface LawyerFormData {
  documentType: string;
  identityDocument: string;
  specialties: string;
  description: string;
  feePerHour: string;
  experienceYears: string;
  profilePicture: File | null;
}

export interface VerificationStatus {
  isValid: boolean;
  message: string;
}

export const useLawyerRegistration = () => {
  const router = useRouter();
  
  const [formData, setFormData] = useState<LawyerFormData>({
    documentType: "",
    identityDocument: "",
    specialties: "",
    description: "",
    feePerHour: "",
    experienceYears: "",
    profilePicture: null,
  });
  
  const [loading, setLoading] = useState(false);
  const [verificationModal, setVerificationModal] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus | null>(null);
  const [currentSpecialty, setCurrentSpecialty] = useState("");

  const documentTypeOptions = Object.entries(DocumentType).map(
    ([key, value]) => ({
      value,
      label: DocumentTypeMapping[value].label,
    })
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (file: File | null) => {
    setFormData((prev) => ({ ...prev, profilePicture: file }));
  };

  const handleAddSpecialty = () => {
    if (currentSpecialty.trim()) {
      setFormData((prev) => ({
        ...prev,
        specialties: prev.specialties
          ? `${prev.specialties}, ${currentSpecialty.trim()}`
          : currentSpecialty.trim(),
      }));
      setCurrentSpecialty("");
    }
  };

  const handleRemoveSpecialty = (indexToRemove: number) => {
    const specialtiesArray = formData.specialties
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s);
    
    const updatedSpecialties = specialtiesArray
      .filter((_, index) => index !== indexToRemove)
      .join(", ");
    
    setFormData((prev) => ({
      ...prev,
      specialties: updatedSpecialties,
    }));
  };

  const verifyLawyer = async (): Promise<boolean> => {
    try {
      const documentTypeInfo = DocumentTypeMapping[formData.documentType as DocumentType];
      const tipoDocumentoNumerico = documentTypeInfo?.code;

      if (!tipoDocumentoNumerico) {
        toast({
          title: "Error de validación",
          description: "Por favor, selecciona un tipo de documento válido.",
          variant: "destructive",
        });
        return false;
      }

      toast({
        description: "Verificando tarjeta profesional con la Rama Judicial...",
      });

      const verificationResponse = await axios.post("/api/lawyer-verification", {
        TipoDocumento: tipoDocumentoNumerico,
        NumeroDocumento: formData.identityDocument,
        Calidad: "1",
      });

      if (!verificationResponse.data?.isValid) {
        setVerificationStatus({
          isValid: false,
          message:
            verificationResponse.data?.message ||
            "No se pudo verificar tu tarjeta profesional con la Rama Judicial.",
        });
        setVerificationModal(true);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error en la verificación:", error);
      toast({
        title: "Error en la verificación",
        description: "Hubo un problema al verificar tu tarjeta profesional.",
        variant: "destructive",
      });
      return false;
    }
  };

  const submitRegistration = async (): Promise<boolean> => {
    try {
      const submissionData = {
        ...formData,
        specialties: formData.specialties.split(",").map((s) => s.trim()),
        feePerHour: parseFloat(formData.feePerHour) || undefined,
        experienceYears: parseInt(formData.experienceYears, 10) || 0,
      };

      await axios.post("/api/lawyer/register", submissionData);

      toast({
        title: "Registro exitoso",
        description: "Tu perfil de abogado ha sido creado correctamente.",
      });

      router.push("/dashboard");
      return true;
    } catch (error) {
      console.error("Error en el registro de abogado:", error);
      toast({
        title: "Error en el registro",
        description: "Hubo un problema al registrar tu perfil.",
        variant: "destructive",
      });
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const isVerificationSuccessful = await verifyLawyer();
      if (isVerificationSuccessful) {
        await submitRegistration();
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    loading,
    verificationModal,
    verificationStatus,
    currentSpecialty,
    documentTypeOptions,
    handleChange,
    handleSelectChange,
    handleFileChange,
    handleAddSpecialty,
    handleRemoveSpecialty,
    handleSubmit,
    setVerificationModal,
    setCurrentSpecialty,
  };
};
