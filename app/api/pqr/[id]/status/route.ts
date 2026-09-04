import { proxyToBackend } from "@/lib/api/proxy";

/**
 * El ciudadano da por resuelta su PQRSD → `PATCH /pqr/:id/status`.
 *
 * Bloque A (contrato congelado). Mismo sobre de tres claves
 * `{ success, data, message }` —tipado literalmente en el backend para que no
 * se pierda— con `data` trayendo `department` completo, `creator` y
 * `customFieldValues`. Conserva 400 (estado distinto de `RESOLVED`), 401 y 404.
 */
export async function PATCH(request: Request, { params }: any) {
  const { id } = await params;
  return proxyToBackend(request, `/pqr/${encodeURIComponent(id)}/status`);
}
