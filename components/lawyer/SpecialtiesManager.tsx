"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

interface SpecialtiesManagerProps {
  specialties: string;
  currentSpecialty: string;
  onCurrentSpecialtyChange: (value: string) => void;
  onAddSpecialty: () => void;
  onRemoveSpecialty: (index: number) => void;
}

export function SpecialtiesManager({
  specialties,
  currentSpecialty,
  onCurrentSpecialtyChange,
  onAddSpecialty,
  onRemoveSpecialty,
}: SpecialtiesManagerProps) {
  const specialtiesArray = specialties
    .split(",")
    .filter((s) => s.trim())
    .map((s) => s.trim());


  return (
    <div className="space-y-2">
      <Label htmlFor="specialties">Especialidades</Label>
      <div className="flex gap-2">
        <Input
          id="specialties-input"
          placeholder="Ej: Derecho Penal"
          value={currentSpecialty}
          onChange={(e) => onCurrentSpecialtyChange(e.target.value)}
          className="border border-muted flex-1"
        />
        <Button
          type="button"
          variant="outline"
          onClick={onAddSpecialty}
          disabled={!currentSpecialty.trim()}
        >
          Agregar
        </Button>
      </div>
      
      {specialtiesArray.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {specialtiesArray.map((specialty, index) => (
            <div
              key={index}
              className="flex items-center gap-1 px-3 py-1 bg-white border border-primary/20 rounded-full text-sm group hover:bg-muted/20 transition-colors"
            >
              <span className="text-primary/80">{specialty}</span>
              <button
                type="button"
                onClick={() => onRemoveSpecialty(index)}
                className="ml-1 text-red-500 hover:text-red-700 opacity-70 group-hover:opacity-100 transition-opacity"
                title="Eliminar especialidad"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
