"use client";

import { Category, RegionalDepartment, Municipality } from "@prisma/client";
import { useState, useEffect } from "react";
import { Card } from "../ui/card";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ChevronLeft, Search } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { getMunicipalitiesByDepartment, getRegionalDepartments } from "@/services/api/location.service";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SimpleEntity {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  municipalityId: string | null;
}

interface CategorySelectionProps {
  categories: (Category & {
    entities: SimpleEntity[];
  })[];
  onEntitySelect: (entityId: string) => void;
}

export function CategorySelection({
  categories,
  onEntitySelect,
}: CategorySelectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [entitySearchQuery, setEntitySearchQuery] = useState("");
  const [departments, setDepartments] = useState<RegionalDepartment[]>([]);
  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string | null>(null);
  const [selectedMunicipalityId, setSelectedMunicipalityId] = useState<string | null>(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const data = await getRegionalDepartments();
        setDepartments(data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (selectedDepartmentId) {
      const fetchMunicipalities = async () => {
        try {
          const data = await getMunicipalitiesByDepartment(selectedDepartmentId);
          setMunicipalities(data);
        } catch (error) {
          console.error("Error fetching municipalities:", error);
        }
      };
      fetchMunicipalities();
    } else {
      setMunicipalities([]);
    }
  }, [selectedDepartmentId]);

  const filteredCategories = categories.filter((category) => {
    const matchesName = category.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDescription = category.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const hasEntities = category.entities.length > 0;
    return (matchesName || matchesDescription) && hasEntities;
  });

  const filteredEntities = selectedCategory
    ? categories
        .find((cat) => cat.id === selectedCategory.id)
        ?.entities.filter((entity) => {
          const matchesName = entity.name.toLowerCase().includes(entitySearchQuery.toLowerCase());
          const matchesDescription = entity.description?.toLowerCase().includes(entitySearchQuery.toLowerCase());
          const matchesDepartment = selectedDepartmentId
            ? entity.municipalityId && municipalities.some((m) => m.id === entity.municipalityId)
            : true;
          const matchesMunicipality = selectedMunicipalityId
            ? entity.municipalityId === selectedMunicipalityId
            : true;
          return matchesName && matchesDescription && matchesDepartment && matchesMunicipality;
        })
    : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {selectedCategory ? (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setSelectedCategory(null);
                  setSelectedDepartmentId(null);
                  setSelectedMunicipalityId(null);
                }}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {selectedCategory.name}
            </div>
          ) : (
            "Selecciona una categoría"
          )}
        </h2>
      </div>

      {!selectedCategory && (
        <p className="text-sm text-gray-600">
          Descubre las categorías disponibles y encuentra exactamente lo que buscas. Si no sabes a qué categoría pertenece una entidad, utiliza la barra de búsqueda e ingresa palabras clave relacionadas con su nombre o descripción para localizarla fácilmente.
        </p>
      )}

      {!selectedCategory && (
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar categoría"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      )}

      {selectedCategory && (
        <>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar entidad"
              value={entitySearchQuery}
              onChange={(e) => setEntitySearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-4">
            <div className="w-64">
              <Select
                value={selectedDepartmentId || ""}
                onValueChange={(value) => {
                  setSelectedDepartmentId(value || null);
                  setSelectedMunicipalityId(null);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Buscar por departamento" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((department) => (
                    <SelectItem key={department.id} value={department.id}>
                      {department.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedDepartmentId && (
              <div className="w-64">
                <Select
                  value={selectedMunicipalityId || ""}
                  onValueChange={(value) => setSelectedMunicipalityId(value || null)}
                  disabled={!selectedDepartmentId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Buscar por municipio" />
                  </SelectTrigger>
                  <SelectContent>
                    {municipalities.map((municipality) => (
                      <SelectItem key={municipality.id} value={municipality.id}>
                        {municipality.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {selectedCategory ? (
          filteredEntities && filteredEntities.length > 0 ? (
            filteredEntities.map((entity) => (
              <Card
                key={entity.id}
                className={cn(
                  "p-4 cursor-pointer hover:border-primary transition-colors",
                  "flex flex-col items-center justify-center gap-4"
                )}
                onClick={() => onEntitySelect(entity.id)}
              >
                <div className="relative w-32 h-32">
                  {entity.imageUrl ? (
                    <Image
                      src={entity.imageUrl}
                      alt={entity.name}
                      fill
                      className="object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400">Sin imagen</span>
                    </div>
                  )}
                </div>
                <h3 className="font-semibold text-center">{entity.name}</h3>
                {entity.description && (
                  <p className="text-xs text-gray-500 text-center line-clamp-2 px-2">
                    {entity.description}
                  </p>
                )}
              </Card>
            ))
          ) : (
            <p className="text-left text-sm text-gray-500 col-span-full">
              No se encontraron entidades con este criterio de búsqueda.
            </p>
          )
        ) : filteredCategories.length > 0 ? (
          filteredCategories.map((category) => (
            <Card
              key={category.id}
              className={cn(
                "p-4 cursor-pointer hover:border-primary transition-colors",
                "flex flex-col items-center justify-center gap-3"
              )}
              onClick={() => setSelectedCategory(category)}
            >
              <div className="relative w-12 h-12">
                {category.imageUrl ? (
                  <Image
                    src={category.imageUrl}
                    alt={category.name}
                    fill
                    className="object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400">Sin imagen</span>
                  </div>
                )}
              </div>
              <h3 className="font-semibold text-center">{category.name}</h3>
              {category.description && (
                <p className="text-xs text-gray-500 text-left px-2">
                  {category.description}
                </p>
              )}
            </Card>
          ))
        ) : (
          <p className="text-left text-sm text-gray-500 col-span-full">
            No se encontraron categorías con este criterio de búsqueda.
          </p>
        )}
      </div>
    </div>
  );
}