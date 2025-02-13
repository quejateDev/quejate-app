"use client";

import { Category } from "@prisma/client";
import { useState } from "react";
import { Card } from "../ui/card";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

interface SimpleEntity {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
}

interface CategorySelectionProps {
  categories: (Category & { entities: SimpleEntity[] })[];
  onEntitySelect: (entityId: string) => void;
}

export function CategorySelection({
  categories,
  onEntitySelect,
}: CategorySelectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category & { entities: SimpleEntity[] } | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Filtra categorías basadas en el texto ingresado
  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (category.description && category.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Selecciona una Categoría</h2>
      </div>

      {/* Combobox con búsqueda y desplegable */}
      <div className="relative">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-3 flex items-center">
            <Search className="h-4 w-4 text-gray-500" />
          </div>
          <input
            type="text"
            className="w-80 rounded-md border border-input pl-10 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Buscar por nombre o palabras clave"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsDropdownOpen(true);
            }}
            onFocus={() => setIsDropdownOpen(true)}
            onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
          />
        </div>
        
        {/* Desplegable con la lista de categorías */}
        {isDropdownOpen && (
          <div className="absolute z-10 mt-1 w-full rounded-md border bg-white shadow-lg">
            <ul className="max-h-60 overflow-auto py-1">
              {filteredCategories.map((category) => (
                <li
                  key={category.id}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  onMouseDown={() => {
                    setSelectedCategory(category);
                    setSearchQuery(category.name);
                    setIsDropdownOpen(false);
                  }}
                >
                  <div className="font-medium">{category.name}</div>
                  {category.description && (
                    <div className="text-sm text-gray-500">{category.description}</div>
                  )}
                </li>
              ))}
              {filteredCategories.length === 0 && (
                <li className="px-3 py-2 text-gray-500">No se encontraron categorías</li>
              )}
            </ul>
          </div>
        )}
      </div>

      {/* Grid de Entidades */}
      {selectedCategory && (
        <>
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Entidades</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedCategory.entities.map((entity) => (
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
                  <p className="text-sm text-gray-500 text-center">
                    {entity.description}
                  </p>
                )}
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
