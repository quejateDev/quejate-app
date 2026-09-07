import { proxyToBackend } from "@/lib/api/proxy";

/**
 * Dar o quitar «me gusta» a una PQRSD → `POST /pqr/:id/like`.
 *
 * Bloque A (contrato congelado). Devuelve `{ likes, liked }` con **200** —el
 * backend lo fija con un `@HttpCode(OK)` explícito, porque Nest daría 201 en un
 * `POST`—.
 *
 * 🔴 **La otra mitad de H-16.** Aquí tampoco había sesión y el `userId` venía
 * del cuerpo, así que se podían dar y sobre todo **quitar** reacciones en
 * nombre de otra persona. El backend exige sesión y usa la suya.
 */
export async function POST(request: Request, { params }: any) {
  const { id } = await params;
  return proxyToBackend(request, `/pqr/${encodeURIComponent(id)}/like`);
}
