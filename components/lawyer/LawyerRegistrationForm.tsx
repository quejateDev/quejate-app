"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ProfilePictureUploader } from "./ProfilePictureUploader";
import { DocumentUploader } from "./DocumentUploader";
import { SpecialtiesManager } from "./SpecialtiesManager";
import { Info } from "lucide-react";
import { LawyerFormData } from "@/types/lawyer";

interface DocumentTypeOption {
  value: string;
  label: string;
}

interface LawyerRegistrationFormProps {
  formData: LawyerFormData;
  currentSpecialty: string;
  documentTypeOptions: DocumentTypeOption[];
  loading: boolean;
  isUploadingImage: boolean;
  canVerify: () => boolean;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (name: string, value: string) => void;
  onFileChange: (file: File | null) => void;
  onIdentityDocumentImageChange: (file: File) => void;
  onProfessionalCardImageChange: (file: File) => void;
  onRemoveIdentityDocumentImage: () => void;
  onRemoveProfessionalCardImage: () => void;
  onCurrentSpecialtyChange: (value: string) => void;
  onAddSpecialty: () => void;
  onRemoveSpecialty: (index: number) => void;
}

export function LawyerRegistrationForm({
  formData,
  currentSpecialty,
  documentTypeOptions,
  loading,
  isUploadingImage,
  canVerify,
  onSubmit,
  onChange,
  onSelectChange,
  onFileChange,
  onIdentityDocumentImageChange,
  onProfessionalCardImageChange,
  onRemoveIdentityDocumentImage,
  onRemoveProfessionalCardImage,
  onCurrentSpecialtyChange,
  onAddSpecialty,
  onRemoveSpecialty,
}: LawyerRegistrationFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <ProfilePictureUploader
        image={formData.image}
        onFileChange={onFileChange}
        disabled={loading}
        isUploading={isUploadingImage}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="documentType">Tipo de Documento</Label>
          <Select
            onValueChange={(value) => onSelectChange("documentType", value)}
            required
          >
            <SelectTrigger className="border border-muted">
              <SelectValue placeholder="Selecciona un tipo" />
            </SelectTrigger>
            <SelectContent>
              {documentTypeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="identityDocument">Número de Documento</Label>
          <Input
            id="identityDocument"
            name="identityDocument"
            value={formData.identityDocument}
            onChange={onChange}
            required
            className="border border-muted"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="licenseNumber">Número de Licencia</Label>
          <Input
            id="licenseNumber"
            name="licenseNumber"
            value={formData.licenseNumber}
            onChange={onChange}
            required
            className="border border-muted"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DocumentUploader
          id="identityDocumentImage"
          label="Documento de Identidad"
          file={formData.identityDocumentImage}
          onFileChange={onIdentityDocumentImageChange}
          onFileRemove={onRemoveIdentityDocumentImage}
          disabled={loading}
          isUploading={isUploadingImage}
          required={true}
          helpText="Sube una imagen clara de tu documento de identidad por ambos lados"
        />
        
        <DocumentUploader
          id="professionalCardImage"
          label="Tarjeta Profesional"
          file={formData.professionalCardImage}
          onFileChange={onProfessionalCardImageChange}
          onFileRemove={onRemoveProfessionalCardImage}
          disabled={loading}
          isUploading={isUploadingImage}
          required={true}
          helpText="Sube una imagen clara de tu tarjeta profesional de abogado"
        />
      </div>

      <SpecialtiesManager
        specialties={formData.specialties}
        currentSpecialty={currentSpecialty}
        onCurrentSpecialtyChange={onCurrentSpecialtyChange}
        onAddSpecialty={onAddSpecialty}
        onRemoveSpecialty={onRemoveSpecialty}
      />

      <div className="space-y-2">
        <Label htmlFor="description">Descripción Profesional</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Describe tu experiencia y enfoque profesional."
          value={formData.description}
          onChange={onChange}
          className="border border-muted"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="feePerHour">Tarifa por Hora (Opcional)</Label>
          <Input
            id="feePerHour"
            name="feePerHour"
            type="number"
            value={formData.feePerHour}
            onChange={onChange}
            className="border border-muted"
            placeholder="$ COP"
          />
        </div>

      </div>

      <div className="space-y-3">
        {!canVerify() && (
          <div className="flex align-center items-center">
            <Info className="h-4 w-4 mr-1 text-quaternary" />
            <p className="text-xs text-quaternary align-center">
              Debes subir una foto de perfil, documento de identidad y tarjeta profesional antes de poder verificar tu información.
            </p>
          </div>
        )}
        
        <Button 
          type="submit" 
          className="w-full" 
          isLoading={loading}
          disabled={loading || !canVerify()}
        >
          Verificar datos
        </Button>
      </div>
    </form>
  );
}
