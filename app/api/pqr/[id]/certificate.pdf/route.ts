import { proxyToBackend } from "@/lib/api/proxy";

/**
 * Certificado de radicación de una PQRSD en PDF →
 * `GET /pqr/:id/certificate.pdf` del backend (Tarea 26). Solo la usa esta web.
 *
 * Sustituye a `GeneratePQRCertificate.tsx`, que lo maquetaba con jsPDF en el
 * navegador a partir de lo que el cliente tuviera a mano. Ahora lo fabrica el
 * backend desde la base.
 *
 * 🔴 **Solo el autor de la PQRSD, y lo decide el servidor**: `JweAuthGuard` y
 * `findFirst({ where: { id, creatorId } })`. Sin sesión responde **401**; una
 * PQRSD ajena, **404**, igual que una inexistente. El `anonymous` de la PQRSD
 * **no participa** en esa comprobación: solo decide si el nombre se imprime.
 * Por eso la interfaz ofrece la acción sin mirar `pqr.creator` —que depende de
 * quién pregunta (H-18)— y trata el 404 como «no disponible».
 *
 * Mismas cabeceras que el PDF de los documentos legales: el nombre del
 * fichero lo pone el backend (`certificado_pqrsd.pdf`), y el
 * `private, no-store` importa porque lleva el nombre, el asunto y la
 * descripción completa.
 */
export async function GET(request: Request, { params }: any) {
  const { id } = await params;
  return proxyToBackend(
    request,
    `/pqr/${encodeURIComponent(id)}/certificate.pdf`,
    {
      forwardCacheControl: true,
      forwardContentDisposition: true,
    },
  );
}
