"use client";

import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from "axios";
import { Entity, Category } from "@prisma/client";
import { EntityForm } from "@/components/forms/entity-form";

interface EntityWithCategory extends Entity {
  category: Category;
}

export default function EditEntityPage({ params }: { params: { id: string } }) {
  const [entity, setEntity] = useState<EntityWithCategory | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const { id } = params;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [entityResponse, categoriesResponse] = await Promise.all([
          axios.get(`/api/entities/${id}`),
          axios.get('/api/category')
        ]);
        
        setEntity(entityResponse.data);
        setCategories(categoriesResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "No se pudo cargar la entidad",
          variant: "destructive",
        });
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  if (!entity || !categories.length) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader>
            <CardTitle>Cargando...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Editar Entidad</CardTitle>
          <CardDescription>
            Actualiza la información de la entidad seleccionada
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EntityForm 
            categories={categories}
            initialData={{
              id: entity.id,
              name: entity.name,
              description: entity.description || "",
              categoryId: entity.categoryId,
              imageUrl: entity.imageUrl || undefined
            }}
            isEditing={true}
          />
        </CardContent>
      </Card>
    </div>
  );
}
