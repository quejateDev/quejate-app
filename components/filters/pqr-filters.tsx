"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PQRSType } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";

const sortOptions = [
  { label: "Más recientes", value: "date-desc" },
  { label: "Más antiguos", value: "date-asc" },
  { label: "Más likes", value: "likes-desc" },
] as const;

const typeOptions = [
  { label: "Petición", value: "PETITION" },
  { label: "Queja", value: "COMPLAINT" },
  { label: "Reclamo", value: "CLAIM" },
] as const;

interface PQRFiltersProps {
  entities: Array<{ id: string; name: string }>;
  departments: Array<{ id: string; name: string; entityId: string }>;
}

export function PQRFilters({ entities, departments }: PQRFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

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
  };

  const filteredDepartments = currentEntity
    ? departments.filter((dept) => dept.entityId === currentEntity)
    : departments;

  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <Select
        value={currentSort}
        onValueChange={(value) => updateQueryParams("sort", value)}
      >
        <SelectTrigger className="w-[180px]">
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
        <SelectTrigger className="w-[180px]">
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
        <SelectTrigger className="w-[180px]">
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
          <SelectTrigger className="w-[180px]">
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
    </div>
  );
}
