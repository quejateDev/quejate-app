import { proxyToBackend } from "@/lib/api/proxy";

/**
 * Perfil público de un abogado → `GET /lawyer/:id`.
 *
 * Bloque A (contrato congelado). Devuelve
 * `{ id, userId, specialties, description, feePerHour, feePerService,
 * isVerified, averageRating, ratingCount, user { id, name, image }, createdAt }`,
 * con 404 si no existe.
 *
 * 🔴 **Cierra H-09**, que sigue abierto en producción. El manejador que
 * sustituye devolvía `{ ...lawyer, ... }`, y ese *spread* publicaba **sin
 * sesión** la cédula (`identityDocument`), las fotos del documento y de la
 * tarjeta profesional y el número de licencia.
 *
 * ✅ **No rompe a la móvil.** `LawyerDetailScreen.tsx` usa `lawyer.id` y
 * `lawyer.userId`; el único `user?.email` del fichero (línea 81) es **el de la
 * sesión**, para prerrellenar el formulario de contacto, no el del abogado. Un
 * `grep` de `.email` lo habría marcado como rotura: hubo que abrir el fichero.
 */
export async function GET(request: Request, { params }: any) {
  const { id } = await params;
  return proxyToBackend(request, `/lawyer/${encodeURIComponent(id)}`);
}
