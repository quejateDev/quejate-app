import { toast } from "@/hooks/use-toast";

export const sendLawyerRequest = async (
  lawyerId: string,
  message: string,
  clientContactEmail?: string,
  clientContactPhone?: string,
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
        clientContactEmail,
        clientContactPhone,
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
