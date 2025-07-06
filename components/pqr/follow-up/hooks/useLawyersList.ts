import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { LawyerProfileData } from "@/types/lawyer-profile";

export function useLawyersList() {
  const [lawyers, setLawyers] = useState<LawyerProfileData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLawyers = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch("/api/lawyer");
      
      if (!response.ok) {
        throw new Error("Error al obtener el listado de abogados");
      }

      const data = await response.json();
      setLawyers(data);
    } catch (error) {
      console.error("Error fetching lawyers:", error);
      setError("Error al cargar los abogados disponibles");
      toast({
        title: "Error",
        description: "No se pudo cargar el listado de abogados",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLawyers();
  }, []);

  const sendLawyerRequest = async (
    lawyerId: string,
    message: string,
    pqrId?: string
  ) => {
    try {
      const response = await fetch("/api/lawyer/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lawyerId,
          message,
          pqrId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al enviar la solicitud");
      }

      toast({
        title: "Solicitud enviada",
        description: "Tu solicitud ha sido enviada al abogado exitosamente, espera su respuesta, se te notificará cuando haya una actualización.",
        variant: "default",
      });

      return true;
    } catch (error) {
      console.error("Error sending lawyer request:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al enviar la solicitud",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    lawyers,
    isLoading,
    error,
    fetchLawyers,
    sendLawyerRequest,
  };
}
