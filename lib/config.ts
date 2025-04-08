export const  JWT_SECRET = process.env.JWT_SECRET || 'secret';
export const APP_DOMAIN = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const AWS_REGION = process.env.AWS_REGION || 'us-east-2';
export const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID || process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID || '';
export const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY || process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY || '';
export const AWS_BUCKET = process.env.AWS_BUCKET || 'quejate-files';

export const CHART_COLORS = [
  "#2563eb", // Azul brillante
  "#16a34a", // Verde esmeralda
  "#dc2626", // Rojo vibrante
  "#9333ea", // Púrpura real
  "#ea580c", // Naranja intenso
  "#0d9488", // Verde azulado
  "#0891b2", // Cyan vibrante
  "#f59e0b", // Ámbar
  "#6366f1", // Indigo
  "#ec4899", // Rosa intenso
  "#84cc16", // Lima brillante
  "#14b8a6", // Turquesa
];
