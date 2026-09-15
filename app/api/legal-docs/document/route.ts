import { proxyToBackend } from "@/lib/api/proxy";

/**
 * Generar una tutela o un oficio de vigilancia → `POST /legal-docs/document`
 * del backend (Tarea 10). Solo la usa esta web (`pqrFollowUpService.ts`).
 *
 * 🔴 **Sustituye a la Lambda de AWS que la web llamaba desde el navegador**
 * (H-25): su URL iba compilada en el bundle público como
 * `NEXT_PUBLIC_API_GATEWAY_URL`, sin sesión ni límite, así que cualquiera podía
 * generar documentos a cargo de la cuenta de OpenAI de la empresa. Ahora la
 * petición va al mismo origen —la cookie de sesión viaja sola— y el backend
 * exige sesión y aplica el límite por usuario.
 *
 * Mismo cuerpo que la Lambda (`{ documentType, ...datos }`) y misma respuesta
 * (`{ document }`).
 */

/** Ver `app/api/legal-docs/route.ts`: la generación tarda hasta 25 s. */
export const maxDuration = 60;

export async function POST(request: Request) {
  return proxyToBackend(request, "/legal-docs/document");
}
