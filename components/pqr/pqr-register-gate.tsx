"use client";

import Link from "next/link";
import { Bell, ClipboardList, History, Megaphone, ShieldCheck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface PqrRegisterGateProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Entidad elegida; se usa para volver al formulario tras autenticarse. */
  entityId: string | null;
}

const BENEFITS = [
  {
    icon: ClipboardList,
    text: "Haz seguimiento en tiempo real al estado de tu PQRSD.",
  },
  {
    icon: Bell,
    text: "Recibe notificaciones cuando la entidad responda.",
  },
  {
    icon: History,
    text: "Consulta el historial de todas tus solicitudes en un solo lugar.",
  },
  {
    icon: Megaphone,
    text: "Publica en el muro ciudadano y suma apoyo a tu causa.",
  },
  {
    icon: ShieldCheck,
    text: "Tus datos quedan protegidos y tus respuestas centralizadas.",
  },
];

export function PqrRegisterGate({ open, onOpenChange, entityId }: PqrRegisterGateProps) {
  const callbackUrl = entityId ? `/dashboard/pqrs/create/${entityId}` : undefined;
  const withCallback = (path: string) =>
    callbackUrl ? `${path}?callbackUrl=${encodeURIComponent(callbackUrl)}` : path;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Crea tu cuenta para publicar tu PQRSD
          </DialogTitle>
          <DialogDescription>
            Regístrate gratis para enviar tu solicitud y hacerle seguimiento. Solo te
            toma un minuto.
          </DialogDescription>
        </DialogHeader>

        <ul className="space-y-3 py-2">
          {BENEFITS.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-start gap-3">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <Icon className="h-4 w-4" />
              </span>
              <span className="text-sm text-gray-700">{text}</span>
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-2">
          <Button asChild className="h-11 w-full bg-blue-600 text-white hover:bg-blue-700">
            <Link href={withCallback("/auth/register")}>Crear cuenta gratis</Link>
          </Button>
          <Button asChild variant="outline" className="h-11 w-full">
            <Link href={withCallback("/auth/login")}>Ya tengo cuenta, iniciar sesión</Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default PqrRegisterGate;
