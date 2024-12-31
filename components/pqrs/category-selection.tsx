"use client";

import { Category, Entity } from "@prisma/client";
import { useState } from "react";
import { Card } from "../ui/card";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import { Button } from "../ui/button";

interface SimpleEntity {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {selectedCategory ? (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedCategory(null)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {selectedCategory.name}
            </div>
          ) : (
            "Selecciona una Categoría"
          )}
        </h2>
      </div>

      {/* Grid of categories or entities */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {selectedCategory
          ? // Show entities for selected category
            categories
              .find((cat) => cat.id === selectedCategory.id)
              ?.entities.map((entity) => (
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
              ))
          : // Show categories
            categories.map((category) => (
              <Card
                key={category.id}
                className={cn(
                  "p-4 cursor-pointer hover:border-primary transition-colors",
                  "flex flex-col items-center justify-center gap-4"
                )}
                onClick={() => setSelectedCategory(category)}
              >
                <div className="relative w-32 h-32">
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
                  <p className="text-sm text-gray-500 text-center">
                    {category.description}
                  </p>
                )}
                <div className="text-sm text-gray-500">
                  {category.entities.length} entidades
                </div>
              </Card>
            ))}
      </div>
    </div>
  );
}
