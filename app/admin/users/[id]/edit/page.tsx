"use client";

import { useEffect, useState } from "react";
import { ClientForm } from "@/components/forms/client-form";
import { useParams, useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditClientPage() {
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const response = await fetch(`/api/admin/clients/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setClient(data);
        } else {
          throw new Error("Client not found");
        }
      } catch (error) {
        console.error("Error fetching client:", error);
        toast({
          title: "Error",
          description: "No se pudo cargar la información del empleado",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [params.id, toast]);

  if (loading) {
    return (
      <div className="container mx-auto py-10 px-4 md:px-6">
        <div className="flex items-center gap-4 mb-8">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[150px]" />
          </div>
        </div>
        <Card className="border-none shadow-md">
          <CardHeader className="pb-4">
            <Skeleton className="h-8 w-[250px]" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="container mx-auto py-10 px-4 md:px-6">
        <Card className="border-none shadow-md">
          <CardContent className="flex flex-col items-center justify-center py-10">
            <User className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Empleado no encontrado</h2>
            <p className="text-muted-foreground mb-6">
              El empleado que estás buscando no existe o ha sido eliminado.
            </p>
            <Button onClick={() => router.push("/admin/users")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a la lista
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10"
            onClick={() => router.push("/admin/users")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Editar Empleado</h1>
            <p className="text-muted-foreground">
              Actualiza la información del empleado
            </p>
          </div>
        </div>
      </div>

      <Card className="border-none shadow-md">
        <CardHeader className="pb-4">
          <CardTitle>Información del Empleado</CardTitle>
        </CardHeader>
        <CardContent>
          <ClientForm mode="edit" initialData={client} />
        </CardContent>
      </Card>
    </div>
  );
}
