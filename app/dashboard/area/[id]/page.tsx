"use client";

import { useEffect, useState } from "react";
import { AreaForm } from "@/components/forms/area-form";
import { Client } from "@/services/api/Client";
import { Department } from "@prisma/client";
import { toast } from "@/hooks/use-toast";
import {
  Card,
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
} from "@/components/ui/card";
import { useParams } from "next/navigation";

interface AreaPageProps {
  params: {
    id: string;
  };
}

const AreaPage = ({ params }: AreaPageProps) => {
  const [area, setArea] = useState<Department | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  useEffect(() => {
    const fetchArea = async () => {
      try {
        const response = await Client.get(`/area/${id}`);
        setArea(response.data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Error al cargar el área",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchArea();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">Cargando...</div>
    );
  }

  if (!area) {
    return (
      <div className="flex items-center justify-center h-full">
        Área no encontrada
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Editar Área</CardTitle>
          <CardDescription>
            Edita la información de un área existente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AreaForm
            initialData={{
              id: area.id,
              name: area.name,
            }}
            isEditing={true}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AreaPage;
