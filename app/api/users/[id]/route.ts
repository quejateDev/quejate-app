import { proxyToBackend } from "@/lib/api/proxy";

/**
 * Perfil de un usuario → `GET|PATCH|DELETE /users/:id`.
 *
 * Bloque A (contrato congelado) en los tres métodos; el `PATCH` lo usan además
 * tres pantallas de la web.
 *
 * - **`GET`**: `{ id, name, image, role, followers[], following[],
 *   _count { followers, following, PQRS }, isFollowing }`, **más `email` y
 *   `phone` solo si quien pregunta es el titular** (Ley 1581, arreglo de H-05).
 *
 *   🔑 Es la **única** ruta proxiada que reenvía `Cache-Control`, y por eso
 *   lleva `forwardCacheControl`. El `private, max-age=60` forma parte del
 *   contrato de hoy y **tiene que seguir siendo `private`**: la respuesta
 *   depende de quién pregunta, así que una caché compartida podría entregarle a
 *   cualquiera la del titular, con su correo dentro (A-16). El backend emite la
 *   misma cabecera.
 *
 * - **`PATCH`**: los dos modos del original (solo `image`, o el completo con
 *   nombre, teléfono y cambio de contraseña) y la misma respuesta
 *   `{ id, name, email, phone, image }`. Conserva 400, 401, 403 y 404.
 *
 *   ⚠️ El backend añade `FreshSessionGuard`, que puede devolver un **401
 *   nuevo** si la sesión fue revocada. Eso hace que el interceptor de la móvil
 *   (`client.ts:44-47`) cierre la sesión. Solo ocurre después de un
 *   `signout-all`, que hoy no invoca nadie, pero conviene vigilarlo tras el
 *   despliegue.
 *
 * - **`DELETE`**: `{ message, deletedUser { id, name, email } }`, con las
 *   mismas reglas (el titular o un administrador; nunca borrar a un
 *   `SUPER_ADMIN` sin serlo).
 */
export async function GET(request: Request, { params }: any) {
  const { id } = await params;
  return proxyToBackend(request, `/users/${encodeURIComponent(id)}`, {
    forwardCacheControl: true,
  });
}

export async function PATCH(request: Request, { params }: any) {
  const { id } = await params;
  return proxyToBackend(request, `/users/${encodeURIComponent(id)}`);
}

export async function DELETE(request: Request, { params }: any) {
  const { id } = await params;
  return proxyToBackend(request, `/users/${encodeURIComponent(id)}`);
}
