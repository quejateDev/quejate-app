import { proxyToBackend } from "@/lib/api/proxy";

/**
 * Cambiar una valoración propia → `PUT /lawyer/rating/update`.
 *
 * Bloque A (contrato congelado). Devuelve la valoración actualizada con su
 * `client { id, name, image }` y **200**. Conserva 400 (falta `ratingId`, o
 * `score` fuera de 1..5), 403 si la valoración es de otra persona y 404 si no
 * existe.
 */
export async function PUT(request: Request) {
  return proxyToBackend(request, "/lawyer/rating/update");
}
