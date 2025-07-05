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

export const pqrTypeOptions = {
  PETITION: ["tutela", "abogado"],
  CLAIM: ["tutela", "abogado"],
  COMPLAINT: ["oversight", "abogado"],
  REPORT: ["oversight", "abogado"],
  SUGGESTION: ["abogado"],
} as const;
