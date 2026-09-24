import { proxyToBackend } from "@/lib/api/proxy";

/**
 * Un documento legal del titular en PDF → `GET /legal-docs/:id/pdf` del
 * backend (Tareas 26 y 27). Solo la usa esta web; la app publicada no la
 * conoce.
 *
 * Sustituye al maquetado con jsPDF que hacía el navegador. El backend maqueta
 * al vuelo, desde el texto que guardó al generar, **con el formato de su
 * tipo**: la tutela y el oficio a un ente de control no comparten maquetado.
 * Así la web y la app móvil entregan el mismo documento.
 *
 * 🔴 **Solo el titular.** Lo decide el backend: `JweAuthGuard` en todo
 * `LegalDocsController` y el `userId` de la sesión dentro del `where`. Sin
 * sesión responde **401**; un documento ajeno, inexistente o caducado, **404**
 * —nunca 403, que confirmaría que el identificador existe (H-22)—. Esta ruta
 * no copia esa regla: reenvía la identidad de quien pregunta y deja pasar el
 * estado.
 *
 * - `forwardContentDisposition`: el nombre del fichero lo pone el backend,
 *   fijo por tipo (`tutela.pdf`, `oficio_ente_control.pdf`). La web no lo
 *   cambia.
 * - `forwardCacheControl`: el `private, no-store` del backend. El PDF lleva el
 *   nombre, la cédula y la descripción completa de la PQRSD, y ninguna caché
 *   debe guardarlo.
 */
export async function GET(request: Request, { params }: any) {
  const { id } = await params;
  return proxyToBackend(request, `/legal-docs/${encodeURIComponent(id)}/pdf`, {
    forwardCacheControl: true,
    forwardContentDisposition: true,
  });
}
