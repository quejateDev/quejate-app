import { proxyToBackend } from "@/lib/api/proxy";

/**
 * Valoraciones de un abogado → `GET|POST /lawyer/rating`.
 *
 * Bloque A (contrato congelado).
 *
 * - **`GET ?lawyerId=`**: sobre `{ data, averageScore, pagination }`, con
 *   `averageScore` que **sigue pudiendo ser `null`** cuando no hay ninguna
 *   valoración. Conserva 400 sin `lawyerId` y 404 si el abogado no existe.
 * - **`POST`**: **201** con la valoración creada, y los 400 de «no puedes
 *   calificarte a ti mismo» y «ya has calificado a este abogado».
 *
 * ⚠️ Ojo con el parámetro: `lawyerId` es el **`userId`** del abogado, no el id
 * de la fila `Lawyer`. Es como está hoy y el backend lo replica.
 */
export async function GET(request: Request) {
  return proxyToBackend(request, "/lawyer/rating");
}

export async function POST(request: Request) {
  return proxyToBackend(request, "/lawyer/rating");
}
