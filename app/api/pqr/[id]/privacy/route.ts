import { proxyToBackend } from "@/lib/api/proxy";

/**
 * El autor oculta o publica su PQRSD → `PATCH /pqr/:id/privacy`.
 *
 * Bloque A (contrato congelado). Mismo sobre `{ success, data, message }`, con
 * 400 si `private` no es booleano, 401 sin sesión y 404 si la PQRSD no es suya.
 *
 * ⚠️ Es el interruptor que gobierna `PQRActionsSheet.tsx:126`, y el que obligó
 * a que H-18 conserve el `creator` **para el autor** en `GET /pqr` y
 * `GET /pqr/:id`: sin ese `creator`, la móvil calcula `isOwner: false` y deja
 * de ofrecer esta acción sobre la PQRSD propia.
 */
export async function PATCH(request: Request, { params }: any) {
  const { id } = await params;
  return proxyToBackend(request, `/pqr/${encodeURIComponent(id)}/privacy`);
}
