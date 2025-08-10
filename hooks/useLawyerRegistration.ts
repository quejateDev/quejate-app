"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { DocumentType, DocumentTypeMapping } from "@/types/document-types";
import { useCurrentUser } from "./use-current-user";

export interface LawyerFormData {
  documentType: string;
  identityDocument: string;
  identityDocumentImage: File | null;
  professionalCardImage: File | null;
  specialties: string;
  description: string;
  feePerHour: string;
  profilePicture: File | null;
}

export interface VerificationStatus {
  isValid: boolean;
  message: string;
}

export const useLawyerRegistration = () => {
  const router = useRouter();
  const currentUser = useCurrentUser();
  
  const [formData, setFormData] = useState<LawyerFormData>({
    documentType: "",
    identityDocument: "",
    identityDocumentImage: null,
    professionalCardImage: null,
    specialties: "",
    description: "",
    feePerHour: "",
    profilePicture: null,
  });
  
  const [loading, setLoading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
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

  const handleIdentityDocumentImageChange = (file: File) => {
    setFormData((prev) => ({ ...prev, identityDocumentImage: file }));
  };

  const handleProfessionalCardImageChange = (file: File) => {
    setFormData((prev) => ({ ...prev, professionalCardImage: file }));
  };

  const handleRemoveIdentityDocumentImage = () => {
    setFormData((prev) => ({ ...prev, identityDocumentImage: null }));
  };

  const handleRemoveProfessionalCardImage = () => {
    setFormData((prev) => ({ ...prev, professionalCardImage: null }));
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

  const canVerify = () => {
    return formData.profilePicture !== null && 
           formData.identityDocumentImage !== null && 
           formData.professionalCardImage !== null;
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
      let profilePictureUrl: string | undefined;
      let identityDocumentImageUrl: string | undefined;
      let professionalCardImageUrl: string | undefined;

      setIsUploadingImage(true);
      
      if (formData.profilePicture) {
        try {
          const uploadFormData = new FormData();
          uploadFormData.append('file', formData.profilePicture);

          const uploadResponse = await fetch('/api/upload', {
            method: 'POST',
            body: uploadFormData,
          });

          if (!uploadResponse.ok) {
            throw new Error('Error al subir la imagen de perfil');
          }

          const uploadData = await uploadResponse.json();
          profilePictureUrl = uploadData.path || uploadData.url;

          if (!profilePictureUrl) {
            throw new Error('No se recibió URL de la imagen de perfil');
          }

        } catch (error) {
          console.error('Error uploading profile picture:', error);
          toast({
            title: "Error al subir imagen de perfil",
            description: "Hubo un problema al subir tu foto de perfil.",
            variant: "destructive",
          });
          setIsUploadingImage(false);
          return false;
        }
      }

      if (formData.identityDocumentImage) {
        try {
          const uploadFormData = new FormData();
          uploadFormData.append('file', formData.identityDocumentImage);

          const uploadResponse = await fetch('/api/upload', {
            method: 'POST',
            body: uploadFormData,
          });

          if (!uploadResponse.ok) {
            throw new Error('Error al subir el documento de identidad');
          }

          const uploadData = await uploadResponse.json();
          identityDocumentImageUrl = uploadData.path || uploadData.url;

          if (!identityDocumentImageUrl) {
            throw new Error('No se recibió URL del documento de identidad');
          }

        } catch (error) {
          console.error('Error uploading identity document:', error);
          toast({
            title: "Error al subir documento de identidad",
            description: "Hubo un problema al subir tu documento de identidad.",
            variant: "destructive",
          });
          setIsUploadingImage(false);
          return false;
        }
      }
      
      if (formData.professionalCardImage) {
        try {
          const uploadFormData = new FormData();
          uploadFormData.append('file', formData.professionalCardImage);

          const uploadResponse = await fetch('/api/upload', {
            method: 'POST',
            body: uploadFormData,
          });

          if (!uploadResponse.ok) {
            throw new Error('Error al subir la tarjeta profesional');
          }

          const uploadData = await uploadResponse.json();
          professionalCardImageUrl = uploadData.path || uploadData.url;

          if (!professionalCardImageUrl) {
            throw new Error('No se recibió URL de la tarjeta profesional');
          }

        } catch (error) {
          console.error('Error uploading professional card:', error);
          toast({
            title: "Error al subir tarjeta profesional",
            description: "Hubo un problema al subir tu tarjeta profesional.",
            variant: "destructive",
          });
          setIsUploadingImage(false);
          return false;
        }
      }

      setIsUploadingImage(false);

      toast({
        title: "Archivos subidos",
        description: "Todos los documentos se han subido correctamente.",
      });

      const submissionData = {
        documentType: formData.documentType,
        identityDocument: formData.identityDocument,
        identityDocumentImage: identityDocumentImageUrl,
        professionalCardImage: professionalCardImageUrl,
        specialties: formData.specialties.split(",").map((s) => s.trim()),
        description: formData.description,
        feePerHour: parseFloat(formData.feePerHour) || undefined,
      };

      const response = await axios.post("/api/lawyer/register", submissionData);

      if (response.data && profilePictureUrl && currentUser?.id) {
        try {
          await fetch(`/api/users/${currentUser.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ profilePicture: profilePictureUrl }),
          });
        } catch (error) {
          console.error("Error updating profile picture:", error);
        }
      }

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
    isUploadingImage,
    verificationModal,
    verificationStatus,
    currentSpecialty,
    documentTypeOptions,
    canVerify,
    handleChange,
    handleSelectChange,
    handleFileChange,
    handleIdentityDocumentImageChange,
    handleProfessionalCardImageChange,
    handleRemoveIdentityDocumentImage,
    handleRemoveProfessionalCardImage,
    handleAddSpecialty,
    handleRemoveSpecialty,
    handleSubmit,
    setVerificationModal,
    setCurrentSpecialty,
  };
};
