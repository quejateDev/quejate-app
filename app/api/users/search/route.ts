import { proxyToBackend } from "@/lib/api/proxy";

/**
 * Búsqueda de usuarios → `GET /users/search?q=`.
 *
 * Bloque B (solo web): `app/dashboard/users/page.tsx:34`,
 * `components/UserSearchCommand.tsx:51` y, desde A-31,
 * `app/dashboard/social/page.tsx` en cuanto hay texto. Array pelado de hasta 5
 * `{ id, name, role }`, y `[]` cuando no hay término. Con el PR #61 del backend
 * trae además `image` y `_count`, lo que pinta la tarjeta del directorio.
 *
 * Busca solo por nombre: el backend dejó de casar el correo el 10/09/2026
 * (H-17, cerrado), que hacía de esta ruta pública un oráculo de enumeración.
 */
export async function GET(request: Request) {
  return proxyToBackend(request, "/users/search");
}
