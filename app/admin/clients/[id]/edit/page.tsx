"use client";

import { useEffect, useState } from "react";
import { ClientForm } from "@/components/forms/client-form";
import { useParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function EditClientPage() {
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
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
          description: "No se pudo cargar la información del cliente",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [params.id, toast]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!client) {
    return <div>Cliente no encontrado</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Editar Cliente</h1>
      <ClientForm mode="edit" initialData={client} />
    </div>
  );
}
