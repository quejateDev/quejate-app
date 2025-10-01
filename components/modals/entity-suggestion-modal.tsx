"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Loader2, Plus } from "lucide-react";
import { toast } from '@/hooks/use-toast';
import geoData from "@/data/colombia-geo.json";
import { formatText } from "@/utils/formatText";

interface EntitySuggestionModalProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function EntitySuggestionModal({ 
  trigger, 
  open, 
  onOpenChange 
}: EntitySuggestionModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [entityName, setEntityName] = useState("");
  const [selectedDepartmentId, setSelectedDepartmentId] = useState("");
  const [selectedMunicipalityId, setSelectedMunicipalityId] = useState("");

  const effectiveOpen = open !== undefined ? open : isOpen;
  const effectiveOnOpenChange = onOpenChange || setIsOpen;

  const selectedDepartment = geoData.departments.find(
    dept => dept.id === selectedDepartmentId
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!entityName.trim() || !selectedDepartmentId) {
      toast({
        title: "Error",
        description: "Por favor completa los campos requeridos",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/entity-suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          entityName: entityName.trim(),
          regionalDepartmentId: selectedDepartmentId,
          municipalityId: selectedMunicipalityId || undefined,
        }),
      });

      if (response.ok) {
        toast({
          title: "¡Éxito!",
          description: "Sugerencia enviada exitosamente. Gracias por tu aporte!",
        });
        setEntityName("");
        setSelectedDepartmentId("");
        setSelectedMunicipalityId("");
        effectiveOnOpenChange(false);
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.error || "Error al enviar la sugerencia",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error submitting suggestion:", error);
      toast({
        title: "Error de conexión",
        description: "Error de conexión. Intenta nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDepartmentChange = (departmentId: string) => {
    setSelectedDepartmentId(departmentId);
    setSelectedMunicipalityId("");
  };

  const defaultTrigger = (
    <Button variant="outline">
      <Plus className="h-4 w-4 mr-2" />
      Sugerir nueva entidad
    </Button>
  );

  return (
    <Dialog open={effectiveOpen} onOpenChange={effectiveOnOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      {!trigger && <DialogTrigger asChild>{defaultTrigger}</DialogTrigger>}
      
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>Sugerir nueva entidad</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="entityName">
              Nombre de la entidad <span className="text-red-500">*</span>
            </Label>
            <Input
              id="entityName"
              placeholder="Ej: Alcaldía de Medellín"
              value={entityName}
              onChange={(e) => setEntityName(e.target.value)}
              className="border border-muted"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">
              Departamento <span className="text-red-500">*</span>
            </Label>
            <Select
              value={selectedDepartmentId}
              onValueChange={handleDepartmentChange}
              required
            >
              <SelectTrigger className="border border-muted">
                <SelectValue placeholder="Selecciona un departamento" />
              </SelectTrigger>
              <SelectContent>
                {geoData.departments.map((department) => (
                  <SelectItem key={department.id} value={department.id}>
                    {formatText(department.name)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedDepartment && (
            <div className="space-y-2">
              <Label htmlFor="municipality">Municipio (Opcional)</Label>
              <Select
                value={selectedMunicipalityId}
                onValueChange={setSelectedMunicipalityId}
              >
                <SelectTrigger className="border border-muted">
                  <SelectValue placeholder="Selecciona un municipio" />
                </SelectTrigger>
                <SelectContent>
                  {selectedDepartment.municipalities.map((municipality) => (
                    <SelectItem key={municipality.id} value={municipality.id}>
                      {formatText(municipality.name)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => effectiveOnOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Enviar sugerencia
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
