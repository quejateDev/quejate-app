"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { useState } from "react";

const sortOptions = [
  { label: "Más recientes", value: "date-desc" },
  { label: "Más antiguos", value: "date-asc" },
  { label: "Más likes", value: "likes-desc" },
] as const;

const typeOptions = [
  { label: "Petición", value: "PETITION" },
  { label: "Queja", value: "COMPLAINT" },
  { label: "Reclamo", value: "CLAIM" },
  { label: "Sugerencia", value: "SUGGESTION" },
  { label: "Denuncia", value: "REPORT" }
] as const;

interface PQRFiltersProps {
  entities: Array<{ id: string; name: string }>;
  departments: Array<{ id: string; name: string; entityId: string }>;
}

export function PQRFilters({ entities, departments }: PQRFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  const currentType = searchParams.get("type");
  const currentSort = searchParams.get("sort") || "date-desc";
  const currentEntity = searchParams.get("entity");
  const currentDepartment = searchParams.get("department");

  const updateQueryParams = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value === null) {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    // Reset department if entity changes
    if (key === "entity" && value !== currentEntity) {
      params.delete("department");
    }

    router.push(`?${params.toString()}`);
    setIsOpen(false);
  };

  const filteredDepartments = currentEntity
    ? departments.filter((dept) => dept.entityId === currentEntity)
    : departments;

  const hasActiveFilters = currentType || currentEntity || currentDepartment;

  const FilterContent = () => (
    <>
      <Select
        value={currentSort}
        onValueChange={(value) => updateQueryParams("sort", value)}
      >
        <SelectTrigger className="w-full md:w-[180px] bg-secondary border-quaternary text-quaternary">
          <SelectValue placeholder="Ordenar por" />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={currentType || "all"}
        onValueChange={(value) => updateQueryParams("type", value === "all" ? null : value)}
      >
        <SelectTrigger className="w-full md:w-[180px] bg-secondary border-quaternary text-quaternary">
          <SelectValue placeholder="Tipo de PQR" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los tipos</SelectItem>
          {typeOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={currentEntity || "all"}
        onValueChange={(value) => updateQueryParams("entity", value === "all" ? null : value)}
      >
        <SelectTrigger className="w-full md:w-[180px] bg-secondary border-quaternary text-quaternary">
          <SelectValue placeholder="Entidad" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas las entidades</SelectItem>
          {entities.map((entity) => (
            <SelectItem key={entity.id} value={entity.id}>
              {entity.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {currentEntity && (
        <Select
          value={currentDepartment || "all"}
          onValueChange={(value) => updateQueryParams("department", value === "all" ? null : value)}
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Departamento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los departamentos</SelectItem>
            {filteredDepartments.map((department) => (
              <SelectItem key={department.id} value={department.id}>
                {department.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </>
  );

  return (
    <>
      {/* Desktop View */}
      <div className="hidden md:flex flex-wrap gap-4 mb-6">
        <FilterContent />
      </div>

      {/* Mobile View */}
      <div className="md:hidden mb-6">
        <div className="flex gap-2">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full flex justify-between items-center"
              >
                <span>Filtros</span>
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  {hasActiveFilters && (
                    <span className="h-2 w-2 rounded-full bg-primary" />
                  )}
                </div>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filtros</SheetTitle>
                <SheetDescription>
                  Ajusta los filtros para encontrar PQRs específicos
                </SheetDescription>
              </SheetHeader>
              <div className="py-6 space-y-4">
                <FilterContent />
              </div>
              <SheetFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    const params = new URLSearchParams();
                    params.set("sort", "date-desc");
                    router.push(`?${params.toString()}`);
                    setIsOpen(false);
                  }}
                  className="w-full"
                >
                  Limpiar Filtros
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </>
  );
}
