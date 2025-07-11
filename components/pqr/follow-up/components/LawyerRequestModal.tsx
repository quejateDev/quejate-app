"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { LawyerData } from "@/types/lawyer-profile";
import { PQR } from "@/types/pqrsd";

interface LawyerRequestModalProps {
  lawyer: LawyerData;
  pqrData: PQR;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitRequest: (
    lawyerId: string,
    message: string,
    clientContactEmail?: string,
    clientContactPhone?: string,
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
  const [clientContactEmail, setClientContactEmail] = useState("");
  const [clientContactPhone, setClientContactPhone] = useState("");
  const [contactError, setContactError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      return;
    }

    if (!clientContactEmail.trim() && !clientContactPhone.trim()) {
      setContactError("Debes proporcionar al menos un método de contacto (email o teléfono)");
      return;
    }

    setContactError("");

    const success = await onSubmitRequest(
      lawyer.id,
      message.trim(),
      clientContactEmail.trim() || undefined,
      clientContactPhone.trim() || undefined,
      pqrData.id
    );

    if (success) {
      setMessage("");
      setClientContactEmail("");
      setClientContactPhone("");
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

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Información de contacto
              </Label>
              <p className="text-xs text-gray-500">
                Proporciona al menos un método de contacto para que el abogado pueda comunicarse contigo
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="clientContactEmail" className="text-sm">
                  Email de contacto
                </Label>
                <Input
                  id="clientContactEmail"
                  type="email"
                  placeholder="tu@email.com"
                  value={clientContactEmail}
                  onChange={(e) => setClientContactEmail(e.target.value)}
                  className="bg-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientContactPhone" className="text-sm">
                  Teléfono de contacto
                </Label>
                <Input
                  id="clientContactPhone"
                  type="tel"
                  placeholder="Ej: +57 300 123 4567"
                  value={clientContactPhone}
                  onChange={(e) => setClientContactPhone(e.target.value)}
                  className="bg-white"
                />
              </div>
            </div>

            {contactError && (
              <p className="text-sm text-red-600 mt-2">{contactError}</p>
            )}
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
