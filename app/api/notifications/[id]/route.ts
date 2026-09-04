import { proxyToBackend } from "@/lib/api/proxy";

/**
 * Borrar una notificación → `DELETE /notifications/:id`.
 *
 * Bloque A (contrato congelado). `{ success: true }` con 200, y conserva los
 * dos rechazos que ya distinguía: **403** si la notificación es de otra persona
 * y **404** si no existe.
 */
export async function DELETE(request: Request, { params }: any) {
  const { id } = await params;
  return proxyToBackend(request, `/notifications/${encodeURIComponent(id)}`);
}
