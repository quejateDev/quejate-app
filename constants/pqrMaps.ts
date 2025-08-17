export const typeMap = {
  PETITION: { label: "Petición", color: "text-blue-600" },
  COMPLAINT: { label: "Queja", color: "text-red-600" },
  CLAIM: { label: "Reclamo", color: "text-orange-800" },
  SUGGESTION: { label: "Sugerencia", color: "text-green-600" },
  REPORT: { label: "Denuncia", color: "text-yellow-600" },
} as const;

export const statusMap = {
  PENDING: {
    label: "Pendiente",
    variant: "pending",
  },
  IN_PROGRESS: {
    label: "En Proceso",
    variant: "in_progress",
  },
  RESOLVED: {
    label: "Resuelto",
    variant: "resolved",
  },
  CLOSED: {
    label: "Cerrado",
    variant: "rejected",
  },
} as const;

export const filterStatusOptions = [
  { label: "Todos los estados", value: "all" },
  { label: "Pendiente", value: "PENDING" },
  { label: "En Proceso", value: "IN_PROGRESS" },
  { label: "Resuelto", value: "RESOLVED" },
  { label: "Cerrado", value: "CLOSED" }
] as const;
