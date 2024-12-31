"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { updateEntity } from "@/services/api/entity.service";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Category, Entity } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";

export default function EditEntityPage({ params }: any) {
  const [entity, setEntity] = useState<Entity | null>(null);
  const { id } = params;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: null as File | null,
    categoryId: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [entityResponse, categoriesResponse] = await Promise.all([
          axios.get(`/api/entities/${id}`),
          axios.get("/api/category"),
        ]);

        const entityData = entityResponse.data;
        setEntity(entityData);
        setCategories(categoriesResponse.data);
        // Initialize form data with entity data
        setFormData({
          name: entityData.name || "",
          description: entityData.description || "",
          image: null,
          categoryId: entityData.categoryId || "",
        });
        // Set image preview if entity has an image
        if (entityData.imageUrl) {
          setImagePreview(entityData.imageUrl);
        }
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.categoryId) {
      toast({
        title: "Error",
        description: "Por favor seleccione una categoría",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Upload image first if present
      let imageUrl = entity?.imageUrl || undefined; // Keep existing image if no new one
      if (formData.image) {
        const imageFormData = new FormData();
        imageFormData.append("file", formData.image);

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: imageFormData,
        });

        if (!uploadResponse.ok) {
          throw new Error("Failed to upload image");
        }

        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.path;
      }

      // Update entity with image URL if uploaded
      await updateEntity(id, {
        name: formData.name,
        description: formData.description,
        imageUrl ,
        categoryId: formData.categoryId,
      });

      toast({
        title: "Entidad actualizada",
        description: "La entidad ha sido actualizada exitosamente",
      });
      router.push("/admin/entity");
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Error al actualizar la entidad",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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
            Actualice los datos de la entidad
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Categoría</Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, categoryId: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Logo o Imagen</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="cursor-pointer"
              />
              {imagePreview && (
                <div className="mt-2 relative w-32 h-32">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              )}
            </div>
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/entity")}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-green-500 hover:bg-green-600"
                disabled={loading}
              >
                {loading ? "Actualizando..." : "Actualizar Entidad"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
