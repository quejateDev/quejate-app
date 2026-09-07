import { proxyToBackend } from "@/lib/api/proxy";

/**
 * Entidades favoritas de un usuario → `GET|POST /users/:id/favorite-entities`.
 *
 * Bloque B (solo web): `hooks/useFavoriteEntities.ts:26,50`.
 *
 * - **`GET`**: array pelado con la entidad enriquecida con los nombres de
 *   `municipality` y `department` resueltos desde el catálogo geográfico.
 * - **`POST`**: alterna, y devuelve `{ message, isFavorite }` con **200**
 *   (`@HttpCode(200)` en el backend).
 *
 * El backend conserva la comprobación de H-14 que aquí se añadió: el `:id` de
 * la URL tiene que ser el de la sesión, o **403**. Sin ella, cualquier cuenta
 * con sesión podía leer y modificar los favoritos de otra cambiando el id
 * (OWASP API1 / IDOR).
 */
export async function GET(request: Request, { params }: any) {
  const { id } = await params;
  return proxyToBackend(
    request,
    `/users/${encodeURIComponent(id)}/favorite-entities`,
  );
}

export async function POST(request: Request, { params }: any) {
  const { id } = await params;
  return proxyToBackend(
    request,
    `/users/${encodeURIComponent(id)}/favorite-entities`,
  );
}
