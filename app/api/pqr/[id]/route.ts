import { proxyToBackend } from "@/lib/api/proxy";

/**
 * Detalle de una PQRSD → `GET /pqr/:id`.
 *
 * Bloque A (contrato congelado). Objeto pelado con los mismos escalares,
 * `likes`, `attachments`, `comments` con su `user`, `_count`, `department`,
 * `entity`, `customFieldValues`, `creator`, `statusHistory`, `isOverdue` y
 * `businessDaysOverdue`; menos `guest*` y más `hasLegalDeadline`, como el muro.
 *
 * Conserva el **403** de las PQRSD privadas para quien no es su autor ni
 * personal autorizado, y el **404** de la que no existe.
 *
 * 🔴 Cierra H-18 igual que el muro: `creator: null` en las anónimas salvo para
 * su autor, que lo necesita para el `isOwner` de `DetailHeader.tsx:104`.
 */
export async function GET(request: Request, { params }: any) {
  const { id } = await params;
  return proxyToBackend(request, `/pqr/${encodeURIComponent(id)}`);
}
