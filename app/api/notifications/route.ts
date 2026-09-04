import { proxyToBackend } from "@/lib/api/proxy";

/**
 * Notificaciones del usuario → `GET|PATCH|DELETE /notifications`.
 *
 * Bloque A (contrato congelado) en los tres.
 *
 * - **`GET`**: array pelado con las 20 más recientes. Conserva el **efecto
 *   secundario** del original: antes de responder crea las notificaciones de
 *   PQRSD vencida que falten. No es un detalle de implementación — es la única
 *   vía por la que esas notificaciones llegan a existir.
 * - **`PATCH`**: `{ success: true }`, con los dos cuerpos que acepta hoy
 *   (`{ markAll: true }` o `{ notificationId }`).
 *
 *   ⚠️ Marcar una notificación ajena pasa de **500** a **404**. Es una mejora,
 *   no un cambio de contrato observable: la móvil trata cualquier fallo igual
 *   (`useNotifications.ts` con `skipAuth401`).
 * - **`DELETE`**: `{ success: true, deleted: number }` (borra todas las del
 *   usuario).
 */
export async function GET(request: Request) {
  return proxyToBackend(request, "/notifications");
}

export async function PATCH(request: Request) {
  return proxyToBackend(request, "/notifications");
}

export async function DELETE(request: Request) {
  return proxyToBackend(request, "/notifications");
}
