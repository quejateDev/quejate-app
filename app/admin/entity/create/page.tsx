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
import { createEntity, getCategories } from "@/services/api/entity.service";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Category} from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getMunicipalitiesByDepartment, getRegionalDepartments } from "@/services/api/location.service";

export default function CreateEntityPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [departments, setDepartments] = useState<{ id: string; name: string }[]>([]);
  const [municipalities, setMunicipalities] = useState<{ id: string; name: string }[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: null as File | null,
    categoryId: "",
    email: "",
    municipalityId: "",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast({
          title: "Error",
          description: "Error al cargar las categorías",
          variant: "destructive",
        });
      }
    };

    fetchCategories();
  }, []);

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
    if (!selectedDepartment) {
      setMunicipalities([]);
      return;
    }
  
    const fetchMunicipalities = async () => {
      try {
        const data = await getMunicipalitiesByDepartment(selectedDepartment);
        setMunicipalities(data);
      } catch (error) {
        console.error("Error fetching municipalities:", error);
      }
    };
  
    fetchMunicipalities();
  }, [selectedDepartment]);
  

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
      let imageUrl = null;
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

      // Create entity with image URL if uploaded
      await createEntity({
        name: formData.name,
        description: formData.description,
        categoryId: formData.categoryId,
        imageUrl: imageUrl,
        email: formData.email,
        municipalityId: formData.municipalityId
      });

      toast({
        title: "Entidad creada",
        description: "La entidad ha sido creada exitosamente",
      });
      router.push("/admin/entity");
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Error al crear la entidad",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Crear Nueva Entidad</CardTitle>
          <CardDescription>
            Ingrese los datos de la nueva entidad
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
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="correo@entidad.com"
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
              <Label htmlFor="department">Departamento</Label>
              <Select
                value={selectedDepartment || ""}
                onValueChange={(value) => {
                  setSelectedDepartment(value);
                  setFormData((prev) => ({ ...prev, municipalityId: "" })); 
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un departamento" />
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

            <div className="space-y-2">
              <Label htmlFor="municipality">Ciudad / Municipio</Label>
              <Select
                value={formData.municipalityId}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, municipalityId: value }))
                }
                disabled={!selectedDepartment}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un municipio" />
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
                {loading ? "Creando..." : "Crear Entidad"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
