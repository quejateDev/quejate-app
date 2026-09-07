import { proxyToBackend } from "@/lib/api/proxy";

/**
 * Muro público de PQRSD → `GET /pqr`; radicar una PQRSD → `POST /pqr`.
 *
 * Bloque A (contrato congelado), y el par de más tráfico de la plataforma.
 *
 * ## `GET` — el sobre `{ pqrs, hasMore, nextPage }`
 *
 * El backend devuelve el mismo sobre (**sin** `totalCount`, que solo lleva
 * `/pqr/user/:id`; la asimetría es deliberada en los dos lados) y el mismo
 * elemento, con dos diferencias buscadas:
 *
 * - **quita** `guestName` / `guestEmail` / `guestPhone`, que aquí se colaban
 *   por el `include` y no lee ningún cliente (R-11);
 * - **añade** `hasLegalDeadline`, aditivo.
 *
 * 🔴 **Y cierra H-18.** En una PQRSD con `anonymous: true` el `creator` sale
 * `null` para todo el mundo **salvo para su propio autor**, que lo sigue
 * recibiendo entero. Ese matiz no es cosmético: `isOwner = user.id ===
 * pqr.creator?.id` (`PQRCard.tsx:90`) gobierna el interruptor de privacidad de
 * la móvil, así que nulificarlo también para el autor le quitaría el control
 * sobre su propia PQRSD. El tipo de la móvil ya es
 * `creator?: {...} | null` (`core/types/index.ts:250`) y todas sus pantallas
 * usan `?.`.
 *
 * ## `POST` — `multipart/form-data` con un único campo `data`
 *
 * Mismo cuerpo y misma respuesta (la PQRSD con `department`, `entity`,
 * `customFieldValues`, `attachments` y `creator`). El servidor sigue derivando
 * el `creatorId` de la sesión e ignorando el del cuerpo.
 *
 * ⚠️ **`statusMap: { 201: 200 }`.** Nest responde 201 donde Next respondía 200.
 * `useCreatePQR.ts:88` solo lee `res.data` y no mira el estado, pero la
 * paridad estricta cuesta esta línea (§3 del brief de la Tarea 13).
 */
export async function GET(request: Request) {
  return proxyToBackend(request, "/pqr");
}

export async function POST(request: Request) {
  return proxyToBackend(request, "/pqr", { statusMap: { 201: 200 } });
}
