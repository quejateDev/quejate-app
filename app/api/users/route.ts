import { proxyToBackend } from "@/lib/api/proxy";

/**
 * Directorio público de usuarios → `GET /users`.
 *
 * Bloque B (solo web): `app/dashboard/social/page.tsx:33` y
 * `app/dashboard/users/page.tsx:35`.
 *
 * 🔴 **Era uno de los cinco huecos del backend.** Se implementó allí en vez de
 * mover las dos pantallas a `GET /users/search`, y la razón está medida, no
 * supuesta: la búsqueda devuelve tres campos (`id`, `name`, `role`) y estas
 * pantallas pintan el avatar y los contadores, y además cargan la lista **sin
 * término**, donde la búsqueda responde `[]`.
 *
 * Misma forma que aquí: hasta 50 usuarios por `createdAt desc`, sin `ADMIN` ni
 * `SUPER_ADMIN`, con `_count { followers, following, PQRS }` y **sin `email`**
 * (H-05: el listado es público y el correo permitía cosecharlos todos de una
 * petición).
 */
export async function GET(request: Request) {
  return proxyToBackend(request, "/users");
}
