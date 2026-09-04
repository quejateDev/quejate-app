import { proxyToBackend } from "@/lib/api/proxy";

/**
 * PQRSD radicadas por un usuario → `GET /pqr/user/:id`.
 *
 * Bloque A (contrato congelado). Sobre `{ pqrs, hasMore, nextPage, totalCount }`
 * —aquí **sí** va `totalCount`, a diferencia del muro— y sesión **opcional**:
 * el dueño del perfil ve además las privadas.
 *
 * 🔴 **H-18 se aplica distinto aquí, y a propósito.** En un perfil ajeno las
 * PQRSD anónimas no se sirven con el autor vacío: se **omiten**. Vaciar el
 * `creator` no protegería nada, porque el vínculo lo establece la propia ruta
 * —`/pqr/user/:id` ya está preguntando «qué radicó esta persona»—.
 *
 * ⚠️ Como consecuencia, `totalCount` **difiere** entre el dueño y un visitante:
 * cuenta lo que quien pregunta puede ver. La móvil lo usa para pintar el
 * contador del perfil, no para paginar (pagina con `nextPage`).
 */
export async function GET(request: Request, { params }: any) {
  const { id } = await params;
  return proxyToBackend(request, `/pqr/user/${encodeURIComponent(id)}`);
}
