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
import { SpecialtiesManager } from "./SpecialtiesManager";
import { LawyerFormData } from "@/hooks/useLawyerRegistration";

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
  onSubmit: (e: React.FormEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (name: string, value: string) => void;
  onFileChange: (file: File | null) => void;
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
  onSubmit,
  onChange,
  onSelectChange,
  onFileChange,
  onCurrentSpecialtyChange,
  onAddSpecialty,
  onRemoveSpecialty,
}: LawyerRegistrationFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <ProfilePictureUploader
        profilePicture={formData.profilePicture}
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
        
        <div className="space-y-2">
          <Label htmlFor="experienceYears">Años de Experiencia</Label>
          <Input
            id="experienceYears"
            name="experienceYears"
            type="number"
            value={formData.experienceYears}
            onChange={onChange}
            required
            className="border border-muted"
            min="0"
          />
        </div>
      </div>

      <Button type="submit" className="w-full" isLoading={loading}>
        Verificar datos
      </Button>
    </form>
  );
}
