import { proxyToBackend } from "@/lib/api/proxy";

/**
 * Solicitudes de asesoría → `GET|POST|PATCH /lawyer/request`.
 *
 * Tres consumidores distintos en la misma ruta, porque Next obliga a que todos
 * los métodos de un camino vivan en un fichero:
 *
 * - **`GET`** — bloque B (solo web): la bandeja del abogado,
 *   `components/lawyer/LawyerRequestsList.tsx:67` y `hooks/useLawyerRequests.ts:43`.
 *   Mismo sobre `{ data, pagination }` y mismos filtros `status`, `page` y
 *   `limit`. El `Lawyer` se resuelve por el `userId` del token, así que no hay
 *   forma de leer la bandeja de otro abogado; 403 si el usuario no tiene perfil
 *   de abogado o su cuenta está inactiva.
 *
 *   ⚠️ **El ciudadano embebido deja de traer `email` y `phone` de su cuenta.**
 *   Los datos de contacto del formulario (`clientContactEmail`,
 *   `clientContactPhone`) **sí** viajan: son los que el ciudadano decidió
 *   compartir, y son los únicos que pinta la pantalla
 *   (`LawyerRequestsList.tsx:219-228`). Mientras el servidor mandara además el
 *   correo de registro y el teléfono del perfil, dejar esos dos campos vacíos
 *   no servía de nada (mismo criterio que A-16).
 *
 *   ⚠️ `page`, `limit` y `status` se validan: `?page=abc` o un `status` fuera
 *   del enum pasan de **500** a **400**.
 *
 * - **`POST`** — bloque A, repuntado en el commit anterior: lo llama la móvil.
 *
 * - **`PATCH`** — bloque B (solo web): aceptar, rechazar o completar. **200**
 *   con la solicitud actualizada, y las mismas transiciones legales
 *   (`PENDING` → `ACCEPTED`|`REJECTED`; `ACCEPTED` → `COMPLETED`|`REJECTED`).
 *   Las notificaciones al ciudadano siguen siendo *best-effort*.
 *
 *   ⚠️ El backend lleva el estado esperado dentro del `UPDATE`, así que dos
 *   peticiones simultáneas ya no pueden dejar la solicitud aceptada y rechazada
 *   a la vez: la segunda recibe el mismo 400 que una transición ilegal.
 */
export async function GET(request: Request) {
  return proxyToBackend(request, "/lawyer/request");
}

export async function POST(request: Request) {
  return proxyToBackend(request, "/lawyer/request");
}

export async function PATCH(request: Request) {
  return proxyToBackend(request, "/lawyer/request");
}
