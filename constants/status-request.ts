import { Check, CheckCircle, Clock, X } from "lucide-react";

export const statusConfig = {
  PENDING: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-800', icon: Clock },
  ACCEPTED: { label: 'Aceptado', color: 'bg-blue-100 text-blue-800 hover:bg-blue-800', icon: Check },
  REJECTED: { label: 'Rechazado', color: 'bg-red-100 text-red-800 hover:bg-red-800', icon: X },
  COMPLETED: { label: 'Completado', color: 'bg-green-100 text-green-800 hover:bg-green-800', icon: CheckCircle },
};