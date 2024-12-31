"use client";

import { useEffect, useState } from "react";
import { AreaForm } from "@/components/forms/area-form";
import { toast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from "axios";
import { Department } from "@prisma/client";

export default function EditAreaPage({ params }: any) {
  const [area, setArea] = useState<Department | null>(null);
  const { id } = params;

  useEffect(() => {
    const fetchArea = async () => {
      try {
        const response = await axios.get(`/api/area/${id}`);
        setArea(response.data);
      } catch (error) {
        console.error("Error fetching area:", error);
        toast({
          title: "Error",
          description: "No se pudo cargar el área",
          variant: "destructive",
        });
      }
    };

    if (id) {
      fetchArea();
    }
  }, [id]);

  if (!area) {
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
          <CardTitle>Editar Área</CardTitle>
          <CardDescription>
            Actualiza la información del área seleccionada
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AreaForm initialData={area} />
        </CardContent>
      </Card>
    </div>
  );
}
