"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";
import { Prisma } from "@prisma/client";

type PqrFiltersProps = {
  categories: Prisma.CategoryGetPayload<{
    include: {
      entities: {
        include: {
          Department: true;
        };
      };
    };
  }>[];
};

export function PqrFilters({ categories }: PqrFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get unique categories from entities
  const selectedCategoryIds = searchParams.getAll("categoryId");
  const uniqueCategories = Array.from(new Set(selectedCategoryIds)).filter(
    Boolean
  );

  const entities = categories
    .filter((category) => uniqueCategories.includes(category.id))
    .flatMap((category) => category.entities);

  // Get unique entities from categories
  const selectedEntityIds = searchParams.getAll("entityId");
  const uniqueEntityIds = Array.from(new Set(selectedEntityIds)).filter(
    Boolean
  );
  const selectedEntities = entities.filter((entity) =>
    uniqueEntityIds.includes(entity.id)
  );

  // Get unique departments from entities
  const selectedDepartmentIds = searchParams.getAll("departmentId");
  const uniqueDepartmentIds = Array.from(new Set(selectedDepartmentIds)).filter(
    Boolean
  );
  const selectedDepartments = selectedEntities.flatMap((entity) =>
    entity.Department.filter((department) =>
      uniqueDepartmentIds.includes(department.id)
    )
  );

  // Get departments based on selected entity
  // const selectedEntityId = searchParams.get("entityId");
  // const selectedEntity = entities.find((e) => e.id === selectedEntityId);
  // const departments = selectedEntity?.departments || [];

  function updateFilters(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    // If entity changes, clear department
    if (key === "entityId") {
      params.delete("departmentId");
    }

    router.push(`?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-4">
      <Select
        value={searchParams.get("categoryId") || ""}
        onValueChange={(value) => updateFilters("categoryId", value)}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Filtrar por categoría" />
        </SelectTrigger>

        <SelectContent>
          {/* <SelectItem value="">Todas las categorias</SelectItem> */}
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={searchParams.get("entityId") || ""}
        onValueChange={(value) => updateFilters("entityId", value)}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Filtrar por entidad" />
        </SelectTrigger>
        <SelectContent>
          {/* <SelectItem value="">Todas las entidades</SelectItem> */}
          {entities.map((entity) => (
            <SelectItem key={entity.id} value={entity.id}>
              {entity.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={searchParams.get("departmentId") || ""}
        onValueChange={(value) => updateFilters("departmentId", value)}
        disabled={!selectedEntityIds}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Filtrar por departamento" />
        </SelectTrigger>
        <SelectContent>
          {/* <SelectItem value="">Todos los departamentos</SelectItem> */}
          {selectedDepartments.map((department) => (
            <SelectItem key={department.id} value={department.id}>
              {department.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
