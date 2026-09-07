import { proxyToBackend } from "@/lib/api/proxy";

/**
 * Comentarios de una PQRSD → `GET|POST /pqr/:id/comments`.
 *
 * Bloque A (contrato congelado).
 *
 * - **`GET`**: array pelado, más recientes primero, cada comentario con
 *   `user { id, name, image }`. Público, como aquí.
 * - **`POST`**: misma forma de respuesta y mismo **201**.
 *
 * 🔴 **El `POST` cierra H-16 sin cambiar la forma.** El manejador que sustituye
 * no comprobaba sesión y tomaba el `userId` **del cuerpo**: cualquiera en
 * internet podía publicar un comentario firmado con el nombre de cualquier
 * ciudadano. El backend exige sesión y toma el autor de ella, descartando el
 * `userId` del cuerpo.
 *
 * ✅ **Y no rompe a la móvil**, que en esta pantalla va siempre autenticada:
 * `useComments.ts:26` llama por `apiClient`, cuyo interceptor adjunta el
 * `Bearer` en todas las peticiones.
 */
export async function GET(request: Request, { params }: any) {
  const { id } = await params;
  return proxyToBackend(request, `/pqr/${encodeURIComponent(id)}/comments`);
}

export async function POST(request: Request, { params }: any) {
  const { id } = await params;
  return proxyToBackend(request, `/pqr/${encodeURIComponent(id)}/comments`);
}
