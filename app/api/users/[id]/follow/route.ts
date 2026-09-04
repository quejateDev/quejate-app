import { proxyToBackend } from "@/lib/api/proxy";

/**
 * Seguir o dejar de seguir a un usuario → `POST /users/:id/follow`.
 *
 * Bloque A (contrato congelado). Devuelve
 * `{ followed, counts: { followers, following, PQRS } }` con **200** —el
 * backend lo fija con `@HttpCode(200)`, porque Nest daría 201—.
 */
export async function POST(request: Request, { params }: any) {
  const { id } = await params;
  return proxyToBackend(request, `/users/${encodeURIComponent(id)}/follow`);
}
