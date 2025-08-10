import { useState } from "react";
import { DocumentType, DocumentTypeMapping } from "@/types/document-types";

export interface LawyerFormData {
  documentType: string;
  identityDocument: string;
  identityDocumentImage: File | null;
  professionalCardImage: File | null;
  specialties: string;
  description: string;
  feePerHour: string;
  image: File | null;
}

const initialFormData: LawyerFormData = {
  documentType: "",
  identityDocument: "",
  identityDocumentImage: null,
  professionalCardImage: null,
  specialties: "",
  description: "",
  feePerHour: "",
  image: null,
};

export const useLawyerRegistrationForm = () => {
  const [formData, setFormData] = useState<LawyerFormData>(initialFormData);
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

  const removeSpecialty = (index: number) => {
    const specialtiesArray = formData.specialties
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s);
    
    specialtiesArray.splice(index, 1);
    setFormData((prev) => ({
      ...prev,
      specialties: specialtiesArray.join(", "),
    }));
  };

  const handleProfilePictureChange = (file: File | null) => {
    setFormData((prev) => ({ ...prev, image: file }));
  };

  const handleIdentityDocumentImageChange = (file: File) => {
    setFormData((prev) => ({ ...prev, identityDocumentImage: file }));
  };

  const handleProfessionalCardImageChange = (file: File) => {
    setFormData((prev) => ({ ...prev, professionalCardImage: file }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setCurrentSpecialty("");
  };

  const validateForm = () => {
    const errors: string[] = [];

    if (!formData.documentType) {
      errors.push("Tipo de documento es requerido");
    }

    if (!formData.identityDocument.trim()) {
      errors.push("Número de documento es requerido");
    }

    if (!formData.identityDocumentImage) {
      errors.push("Imagen del documento de identidad es requerida");
    }

    if (!formData.professionalCardImage) {
      errors.push("Imagen de la tarjeta profesional es requerida");
    }

    if (!formData.description.trim()) {
      errors.push("Descripción profesional es requerida");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  };

  const prepareSubmissionData = () => {
    return {
      ...formData,
      specialties: formData.specialties
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s),
      feePerHour: parseFloat(formData.feePerHour) || undefined
    };
  };

  const getSpecialtiesArray = () => {
    return formData.specialties
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s);
  };

  return {
    formData,
    setFormData,
    currentSpecialty,
    setCurrentSpecialty,
    documentTypeOptions,

    handleChange,
    handleSelectChange,
    handleAddSpecialty,
    removeSpecialty,
    handleProfilePictureChange,
    handleIdentityDocumentImageChange,
    handleProfessionalCardImageChange,

    resetForm,
    validateForm,
    prepareSubmissionData,
    getSpecialtiesArray,
  };
};
