import tutelaIcon from "@/public/animated-icons/ley.json";
import abogadoIcon from "@/public/animated-icons/mujer-abogada.json";
import enteIcon from "@/public/animated-icons/documentos-legales.json";

export const followUpOptions = {
  tutela: {
    icon: tutelaIcon,
    title: "Generar acción de tutela",
    description: "Crea un documento legal para proteger tus derechos fundamentales",
    colorClass: "blue",
  },
  abogado: {
    icon: abogadoIcon,
    title: "Contactar abogado",
    description: "Recibe asesoría legal especializada para tu caso",
    colorClass: "gray",
  },
  oversight: {
    icon: enteIcon,
    title: "Enviar a ente de control",
    description: "Presentar pruebas ante el ente de control correspondiente",
    colorClass: "purple",
  },
};

// Cuando una PQRSD se vence se ofrecen todas las opciones y el ciudadano
// escoge (decisión de la dirección del 05/10/2026). La sugerencia no tiene
// plazo legal: no se vence, y la ventana de vencimiento no se abre para ella
// (`PQRCardHeader`).
export const pqrTypeOptions = {
  PETITION: ["tutela", "oversight", "abogado"],
  CLAIM: ["tutela", "oversight", "abogado"],
  COMPLAINT: ["tutela", "oversight", "abogado"],
  REPORT: ["tutela", "oversight", "abogado"],
  SUGGESTION: ["abogado"],
} as const;
