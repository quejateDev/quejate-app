import { proxyToBackend } from "@/lib/api/proxy";

/**
 * Generar una acción de tutela → `POST /legal-docs` del backend (Tarea 10).
 *
 * 🔴 **Contrato congelado de la app móvil**: la llama con su `Bearer`
 * (`useLegalDocs.ts`) y lee exactamente `{ tutela }`. El backend conserva la
 * ruta y la clave.
 *
 * Antes la tutela se redactaba aquí mismo, con sesión desde H-19 pero **sin
 * límite de peticiones**, y un fallo de la IA respondía **200** con el texto
 * `"Error generando el contenido"`. El backend añade el límite por usuario, la
 * validación de longitudes y errores reales (502/504), que la móvil ya trata
 * igual que ese texto.
 *
 * El comentario que había aquí decía que esta era «la única ruta que la
 * Tarea 13 no repunta» y su sitio permanente. Dejó de serlo cuando la Tarea 10
 * llevó la generación al backend: mantener dos copias del prompt es la figura
 * de casi todos los hallazgos del proyecto.
 */

/**
 * Techo de duración de la función en Vercel.
 *
 * La generación tarda hasta 25 s en el backend (su corte a OpenAI), más el
 * salto por este proxy. Sin declararlo, un proyecto sin *Fluid Compute* corta
 * a los 10 s en el plan Hobby, y el ciudadano vería un error por un documento
 * que sí se generó y se pagó. 60 s es el máximo de Hobby.
 */
export const maxDuration = 60;

export async function POST(request: Request) {
  return proxyToBackend(request, "/legal-docs");
}

/**
 * Historial de documentos legales del titular → `GET /legal-docs` del backend
 * (Tareas 26 y 27). Solo lo usa esta web: la app publicada llama a este mismo
 * path, pero únicamente con `POST`, que no cambia.
 *
 * Un array, del más reciente al más antiguo, de `{ id, type, title, pqrId,
 * createdAt, expiresAt }` —**sin el texto**—, con tutelas (`TUTELA`) y oficios
 * a entes de control (`OVERSIGHT`). Lo que importa lo hace el backend: exige
 * sesión (401 sin ella), devuelve solo los del titular y borra antes los ya
 * vencidos.
 *
 * `forwardCacheControl` para conservar su `private, no-store`: el título de
 * una tutela lleva la entidad demandada.
 */
export async function GET(request: Request) {
  return proxyToBackend(request, "/legal-docs", { forwardCacheControl: true });
}
