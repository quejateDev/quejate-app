import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Mail } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

interface EmailNotVerifiedModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
}

export function EmailNotVerifiedModal({
  isOpen,
  onClose,
  email,
}: EmailNotVerifiedModalProps) {
  const [isResending, setIsResending] = useState(false);

  const handleResendVerification = async () => {
    try {
      setIsResending(true);
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        toast({
          title: "Correo enviado",
          description: "Se ha enviado un nuevo correo de verificación",
          variant: "default",
        });
        onClose();
      } else {
        const data = await response.json();
        toast({
          title: "Error",
          description: data.error || "Error al enviar el correo de verificación",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error resending verification:", error);
      toast({
        title: "Error",
        description: "Error al enviar el correo de verificación",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
            <Mail className="h-6 w-6 text-yellow-600" />
          </div>
          <DialogTitle className="text-center pt-4">
            Verifica tu correo electrónico
          </DialogTitle>
          <DialogDescription className="text-center">
            Tu cuenta aún no ha sido verificada. Por favor, revisa tu correo electrónico y haz clic en el enlace de verificación.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button 
            variant="success" 
            onClick={handleResendVerification}
            disabled={isResending}
          >
            {isResending ? "Enviando..." : "Reenviar correo de verificación"}
          </Button>
          <Button variant="destructive" onClick={onClose}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
