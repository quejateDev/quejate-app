"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PQR } from "@/types/pqrsd";

export interface EntityFilterOption {
  id: string;
  name: string;
  count: number;
}

/**
 * Las entidades de una lista de PQRSD, por nombre y con cuántas hay de cada
 * una. Se agrupa por `id` y no por nombre: dos entidades pueden llamarse igual.
 */
export function entityFilterOptions(pqrs: PQR[]): EntityFilterOption[] {
  const byId = new Map<string, EntityFilterOption>();
  for (const { entity } of pqrs) {
    const option = byId.get(entity.id);
    if (option) {
      option.count += 1;
    } else {
      byId.set(entity.id, { id: entity.id, name: entity.name, count: 1 });
    }
  }
  return Array.from(byId.values()).sort((a, b) => a.name.localeCompare(b.name, "es"));
}

interface EntityFilterProps {
  value: string;
  onValueChange: (value: string) => void;
  options: EntityFilterOption[];
}

export function EntityFilter({ value, onValueChange, options }: EntityFilterProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-full md:w-[240px]">
        <SelectValue placeholder="Filtrar por entidad" />
      </SelectTrigger>
      {/* Hay nombres largos («Superintendencia de Servicios Públicos…»): sin
          tope, el desplegable se salía de la pantalla del teléfono. */}
      <SelectContent className="max-w-[var(--radix-select-content-available-width)]">
        <SelectItem value="all">Todas las entidades</SelectItem>
        {options.map((option) => (
          <SelectItem key={option.id} value={option.id}>
            {`${option.name} (${option.count})`}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
