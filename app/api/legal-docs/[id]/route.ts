import { proxyToBackend } from "@/lib/api/proxy";

/**
 * Un documento legal del titular, con su texto → `GET /legal-docs/:id` del
 * backend (Tarea 26). Solo la usa esta web.
 *
 * Responde `{ id, type, title, pqrId, createdAt, expiresAt, content }`. Mismas
 * reglas que su PDF (`./pdf/route.ts`): solo el titular, **401** sin sesión y
 * **404** para un documento ajeno, inexistente o caducado. Las aplica el
 * backend; esta ruta solo reenvía la identidad.
 *
 * `forwardCacheControl` por lo mismo que allí: `content` es el documento
 * entero, con la cédula dentro.
 */
export async function GET(request: Request, { params }: any) {
  const { id } = await params;
  return proxyToBackend(request, `/legal-docs/${encodeURIComponent(id)}`, {
    forwardCacheControl: true,
  });
}
