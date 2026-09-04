import { proxyToBackend } from "@/lib/api/proxy";

/**
 * Registrar el token de notificaciones push del teléfono → `POST /push-token`.
 *
 * Bloque A (contrato congelado). Devuelve `{ success: true }`.
 *
 * ⚠️ **`statusMap: { 201: 200 }`.** Nest responde 201 donde Next respondía 200.
 * `usePushNotifications.ts:54` envuelve la llamada en un `try/catch` vacío y no
 * mira el estado, pero se traduce igual, por el mismo criterio que
 * `POST /pqr`: la paridad estricta cuesta una línea.
 *
 * ---
 * 🔴 **`DELETE /push-token` se retiró el 04/09/2026 (bloque C).** La móvil no
 * da de baja el token al salir —`usePushNotifications.ts` solo registra— y
 * ningún otro cliente lo llamaba. El backend **sí** tiene el `DELETE`, así que
 * reponerlo aquí el día que la app lo use es una línea.
 */
export async function POST(request: Request) {
  return proxyToBackend(request, "/push-token", { statusMap: { 201: 200 } });
}
