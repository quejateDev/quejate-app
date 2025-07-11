import { useState } from "react";
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

const initialFormData: LawyerFormData = {
  documentType: "",
  identityDocument: "",
  specialties: "",
  description: "",
  feePerHour: "",
  experienceYears: "",
  profilePicture: null,
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
    setFormData((prev) => ({ ...prev, profilePicture: file }));
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

    if (!formData.description.trim()) {
      errors.push("Descripción profesional es requerida");
    }

    if (!formData.experienceYears || parseInt(formData.experienceYears) < 0) {
      errors.push("Años de experiencia válidos son requeridos");
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
      feePerHour: parseFloat(formData.feePerHour) || undefined,
      experienceYears: parseInt(formData.experienceYears, 10) || 0,
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

    resetForm,
    validateForm,
    prepareSubmissionData,
    getSpecialtiesArray,
  };
};
