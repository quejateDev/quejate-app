"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { LawyerProfileData } from "@/types/lawyer-profile";
import { PQR } from "@/types/pqrsd";

interface LawyerRequestModalProps {
  lawyer: LawyerProfileData;
  pqrData: PQR;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitRequest: (
    lawyerId: string,
    message: string,
    pqrId?: string
  ) => Promise<boolean>;
  isLoading?: boolean;
}

export function LawyerRequestModal({
  lawyer,
  pqrData,
  open,
  onOpenChange,
  onSubmitRequest,
  isLoading = false,
}: LawyerRequestModalProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      return;
    }

    const success = await onSubmitRequest(
      lawyer.id,
      message.trim(),
      pqrData.id
    );

    if (success) {
      setMessage("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Solicitar Servicio Legal</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">

          <Card className="bg-blue-50">
            <CardContent className="pt-4">
              <h4 className="text-sm font-medium text-blue-900 mb-2">
                Relacionado con tu PQR:
              </h4>
              <p className="text-sm text-blue-800">
                {pqrData.subject || "Sin asunto especificado"}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Creado el {new Date(pqrData.createdAt).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-sm font-medium">
              Mensaje para el abogado
            </Label>
            <Textarea
              id="message"
              placeholder="Describe brevemente tu situación y qué tipo de ayuda necesitas..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="resize-none bg-white boder-muted"
              required
            />
            <p className="text-xs text-gray-500">
              Incluye detalles relevantes sobre tu caso y qué esperas del servicio legal.
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button 
              type="button"
              className="bg-white text-quaternary hover:bg-gray-100"

              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              className="bg-quaternary text-white hover:bg-quaternary-dark"
              disabled={isLoading || !message.trim()}
            >
              {isLoading ? "Enviando..." : "Enviar Solicitud"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
