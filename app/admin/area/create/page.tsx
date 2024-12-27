// app/dashboard/area/create/page.tsx
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { createDepartmentService } from "@/services/api/Department.service";
import { getEntities } from "@/services/api/entity.service";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Entity } from "@prisma/client";

export default function NewAreaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    entityId: "",
  });

  useEffect(() => {
    async function fetchEntities() {
      try {
        const data = await getEntities();
        setEntities(data);
      } catch (error) {
        console.error("Error fetching entities:", error);
        toast({
          title: "Error",
          description: "Error al cargar las entidades",
          variant: "destructive",
        });
      }
    }

    fetchEntities();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createDepartmentService(formData);
      toast({
        title: "Área creada",
        description: "El área ha sido creada exitosamente",
      });
      router.push("/admin/area");
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Error al crear el área",
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
          <CardTitle>Crear Nueva Área</CardTitle>
          <CardDescription>
            Ingrese los datos del área
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
              <Label htmlFor="entity">Entidad</Label>
              <Select
                value={formData.entityId}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, entityId: value }))
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione una entidad" />
                </SelectTrigger>
                <SelectContent>
                  {entities.map((entity) => (
                    <SelectItem key={entity.id} value={entity.id}>
                      {entity.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/area")}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-green-500 hover:bg-green-600"
                disabled={loading}
              >
                {loading ? "Creando..." : "Crear Área"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
