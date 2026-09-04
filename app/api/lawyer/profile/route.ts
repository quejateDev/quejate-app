import { proxyToBackend } from "@/lib/api/proxy";

/**
 * Perfil propio del abogado → `GET|PATCH /lawyer/profile`.
 *
 * Bloque B (solo web): `hooks/useLawyerProfile.ts:39,77`.
 *
 * El abogado se resuelve por el `userId` de la **sesión**, nunca por un
 * parámetro, igual que aquí. Devuelve la fila con `averageRating`,
 * `ratingCount` y su `user`, que en esta ruta **sí conserva `email` y `phone`**
 * porque quien la lee es el titular. 401 sin sesión, 404 sin perfil.
 *
 * El `PATCH` sigue aceptando solo descripción, tarifa por hora y
 * especialidades; el documento, la licencia y las imágenes no son editables,
 * porque cambiarlos invalidaría una revisión humana ya hecha.
 *
 * ⚠️ La respuesta trae un objeto `verification` que aquí no existía. Es
 * aditivo: `useLawyerProfile.ts` vuelca el JSON entero en su estado.
 */
export async function GET(request: Request) {
  return proxyToBackend(request, "/lawyer/profile");
}

export async function PATCH(request: Request) {
  return proxyToBackend(request, "/lawyer/profile");
}
