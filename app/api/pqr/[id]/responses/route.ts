import { proxyToBackend } from "@/lib/api/proxy";

/**
 * Respuestas de la entidad, para el ciudadano → `GET /pqr/:id/responses`.
 *
 * Bloque B (solo web):
 * `app/dashboard/profile/pqr/[id]/response/[responseId]/page.tsx:135`, que pide
 * la **colección** y busca dentro el elemento que necesita.
 *
 * Mismo sobre `{ pqr, entity, responses }`, con los adjuntos de cada respuesta,
 * y la misma autorización: autor de la PQRSD, personal de la entidad dueña o
 * `SUPER_ADMIN`, con el rol y la entidad releídos **de la base de datos** y no
 * del token. 401, 403 y 404 se conservan.
 *
 * ⚠️ No es `GET /admin/pqr/:id/responses`, que devuelve un array pelado y exige
 * pertenecer a la entidad. Son dos audiencias con dos contratos.
 *
 * ---
 * 🔴 **`POST /pqr/:id/responses` se retiró el 04/09/2026 (bloque C).** La
 * respuesta oficial de una entidad la escribe el **panel**, no esta web ni la
 * móvil, y desde la Tarea 15 lo hace contra
 * `POST /admin/pqr/:id/responses` del backend. No reponerlo.
 */
export async function GET(request: Request, { params }: any) {
  const { id } = await params;
  return proxyToBackend(request, `/pqr/${encodeURIComponent(id)}/responses`);
}
