import { proxyToBackend } from "@/lib/api/proxy";

/**
 * Solicitudes de asesoría que ha enviado el ciudadano →
 * `GET /lawyer/my-requests`.
 *
 * Bloque A (contrato congelado). Mismo sobre
 * `{ data, pagination { total, page, limit, totalPages } }` y mismos filtros
 * (`status`, `page`, `limit`), reenviados tal cual.
 *
 * ⚠️ El `lawyer` de cada elemento viene **reducido**: el original incluía la
 * fila `Lawyer` entera, con la cédula del abogado, en una respuesta que ve el
 * cliente. `MyLawyerRequestsScreen.tsx:37,38,57,58,90` solo lee
 * `item.lawyer?.user.name`, `.image`, `item.message`, `item.createdAt`,
 * `item.status` e `item.lawyerId`.
 */
export async function GET(request: Request) {
  return proxyToBackend(request, "/lawyer/my-requests");
}
