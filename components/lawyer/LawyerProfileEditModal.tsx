"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { LawyerProfileUpdateData } from "@/hooks/useLawyerProfile";
import { LawyerProfileData } from "@/types/lawyer-profile";

interface LawyerProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: LawyerProfileUpdateData) => Promise<void>;
  initialData: LawyerProfileData | null;
}

export function LawyerProfileEditModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: LawyerProfileEditModalProps) {
  const [formData, setFormData] = useState({
    description: "",
    feePerHour: "",
    experienceYears: "",
    specialties: [] as string[],
  });
  const [currentSpecialty, setCurrentSpecialty] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData && isOpen) {
      setFormData({
        description: initialData.description || "",
        feePerHour: initialData.feePerHour?.toString() || "",
        experienceYears: initialData.experienceYears.toString() || "",
        specialties: [...initialData.specialties],
      });
    }
  }, [initialData, isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSpecialty = () => {
    if (currentSpecialty.trim() && !formData.specialties.includes(currentSpecialty.trim())) {
      setFormData((prev) => ({
        ...prev,
        specialties: [...prev.specialties, currentSpecialty.trim()],
      }));
      setCurrentSpecialty("");
    }
  };

  const handleRemoveSpecialty = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      specialties: prev.specialties.filter((_, i) => i !== index),
    }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updateData: LawyerProfileUpdateData = {
        description: formData.description || undefined,
        feePerHour: formData.feePerHour ? parseFloat(formData.feePerHour) : undefined,
        experienceYears: parseInt(formData.experienceYears, 10) || 0,
        specialties: formData.specialties,
      };

      await onSave(updateData);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] bg-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Perfil Profesional</DialogTitle>
          <DialogDescription>
            Actualiza tu información profesional. Los cambios se verán reflejados en tu perfil público.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="description">Descripción Profesional</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe tu experiencia y enfoque profesional..."
              value={formData.description}
              onChange={handleInputChange}
              className="min-h-[100px] border-muted"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="experienceYears">Años de Experiencia</Label>
            <Input
              id="experienceYears"
              name="experienceYears"
              type="number"
              min="0"
              value={formData.experienceYears}
              onChange={handleInputChange}
              className="border-muted"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="feePerHour">Tarifa por Hora (COP)</Label>
            <Input
              id="feePerHour"
              name="feePerHour"
              type="number"
              min="0"
              step="1000"
              placeholder="Ej: 150000"
              value={formData.feePerHour}
              onChange={handleInputChange}
              className="border-muted"
            />
          </div>

          <div className="space-y-3">
            <Label>Especialidades </Label>

            {formData.specialties.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.specialties.map((specialty, index) => (
                  <Badge
                    key={index}
                    className="flex items-center gap-1 text-xs bg-primary text-white"
                  >
                    {specialty}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 w-4 h-4 hover:bg-transparent"
                      onClick={() => handleRemoveSpecialty(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <Input
                placeholder="Agregar nueva especialidad"
                value={currentSpecialty}
                onChange={(e) => setCurrentSpecialty(e.target.value)}
                className="border-muted"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddSpecialty}
                disabled={!currentSpecialty.trim()}
              >
                Agregar
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
