"use client";

import { Search, X } from "lucide-react";
import type { EntityFilterOption } from "@/components/filters/entity-filter";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { statusMap, typeMap } from "@/constants/pqrMaps";
import { cn } from "@/lib/utils";
import { EMPTY_WALL_FILTERS, hasWallFilters, type WallFilters } from "@/lib/wall-filters";
import type { PQR } from "@/types/pqrsd";

/** Valor de la opción «todos» de cada desplegable. */
const ALL = "all";

/** Si las opciones de entidad y de ciudad, que salen del muro entero, ya están. */
export type WallOptionsStatus = "loading" | "ready" | "failed";

interface WallFiltersBarProps {
  filters: WallFilters;
  onChange: (filters: WallFilters) => void;
  entityOptions: EntityFilterOption[];
  entityOptionsStatus: WallOptionsStatus;
  cityOptions: EntityFilterOption[];
  cityOptionsStatus: WallOptionsStatus;
  /**
   * Se llama al abrir el desplegable de entidad o de ciudad. Sus opciones son
   * las del muro entero, y sin filtros todavía no se ha pedido.
   */
  onNeedOptions: () => void;
}

function OptionsState({ status, loading }: { status: WallOptionsStatus; loading: string }) {
  if (status === "ready") return null;
  return (
    <SelectItem value="__estado" disabled>
      {status === "loading" ? loading : "No se pudo cargar la lista."}
    </SelectItem>
  );
}

/**
 * Sin nada elegido, el desplegable dice qué filtra («Tipo») en gris; con algo
 * elegido, lo elegido. «Todos los tipos» no cabía en media columna.
 */
function triggerClass(value: string | null) {
  return cn("bg-white", value === null && "text-muted-foreground");
}

/** El nombre de lo elegido, sin el recuento. */
function selectedName(options: EntityFilterOption[], id: string | null) {
  return options.find((option) => option.id === id)?.name;
}

export function WallFiltersBar({
  filters,
  onChange,
  entityOptions,
  entityOptionsStatus,
  cityOptions,
  cityOptionsStatus,
  onNeedOptions,
}: WallFiltersBarProps) {
  const set = (changes: Partial<WallFilters>) => onChange({ ...filters, ...changes });
  const openOptions = (open: boolean) => {
    if (open) onNeedOptions();
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={filters.text}
          onChange={(event) => set({ text: event.target.value })}
          placeholder="Buscar por asunto, descripción o entidad"
          aria-label="Buscar en el muro"
          className="bg-white pl-9"
        />
      </div>

      {/* Dos columnas a cualquier ancho: con las barras laterales, la columna
          del muro mide lo mismo que un teléfono apaisado. */}
      <div className="grid grid-cols-2 gap-2">
        <Select
          value={filters.type ?? ALL}
          onValueChange={(value) => set({ type: value === ALL ? null : (value as PQR["type"]) })}
        >
          <SelectTrigger className={triggerClass(filters.type)} aria-label="Tipo">
            <SelectValue placeholder="Tipo">
              {filters.type ? typeMap[filters.type].label : "Tipo"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Todos los tipos</SelectItem>
            {Object.entries(typeMap).map(([value, { label }]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.status ?? ALL}
          onValueChange={(value) =>
            set({ status: value === ALL ? null : (value as PQR["status"]) })
          }
        >
          <SelectTrigger className={triggerClass(filters.status)} aria-label="Estado">
            <SelectValue placeholder="Estado">
              {filters.status ? statusMap[filters.status].label : "Estado"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Todos los estados</SelectItem>
            {Object.entries(statusMap).map(([value, { label }]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.entityId ?? ALL}
          onValueChange={(value) => set({ entityId: value === ALL ? null : value })}
          onOpenChange={openOptions}
        >
          <SelectTrigger className={triggerClass(filters.entityId)} aria-label="Entidad">
            <SelectValue placeholder="Entidad">
              {selectedName(entityOptions, filters.entityId) ?? "Entidad"}
            </SelectValue>
          </SelectTrigger>
          {/* Hay nombres largos: sin tope, el desplegable se sale del teléfono. */}
          <SelectContent className="max-w-[var(--radix-select-content-available-width)]">
            <SelectItem value={ALL}>Todas las entidades</SelectItem>
            <OptionsState status={entityOptionsStatus} loading="Cargando las entidades del muro…" />
            {entityOptions.map((option) => (
              <SelectItem key={option.id} value={option.id}>
                {`${option.name} (${option.count})`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.municipalityId ?? ALL}
          onValueChange={(value) => set({ municipalityId: value === ALL ? null : value })}
          onOpenChange={openOptions}
        >
          <SelectTrigger className={triggerClass(filters.municipalityId)} aria-label="Ciudad">
            <SelectValue placeholder="Ciudad">
              {selectedName(cityOptions, filters.municipalityId) ?? "Ciudad"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="max-w-[var(--radix-select-content-available-width)]">
            <SelectItem value={ALL}>Todas las ciudades</SelectItem>
            <OptionsState status={cityOptionsStatus} loading="Cargando las ciudades del muro…" />
            {cityOptions.map((option) => (
              <SelectItem key={option.id} value={option.id}>
                {`${option.name} (${option.count})`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex min-h-9 items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Checkbox
            id="wall-overdue-only"
            checked={filters.overdueOnly}
            onCheckedChange={(checked) => set({ overdueOnly: checked === true })}
          />
          <Label htmlFor="wall-overdue-only" className="cursor-pointer text-sm font-normal">
            Solo vencidas
          </Label>
        </div>
        {hasWallFilters(filters) && (
          <Button variant="ghost" size="sm" onClick={() => onChange(EMPTY_WALL_FILTERS)}>
            <X className="mr-1 h-4 w-4" />
            Quitar filtros
          </Button>
        )}
      </div>
    </div>
  );
}
