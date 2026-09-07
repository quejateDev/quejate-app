import { proxyToBackend } from "@/lib/api/proxy";

/**
 * Canjear el código de seis dígitos por una contraseña nueva →
 * `POST /auth/reset-password`.
 *
 * Bloque A (contrato congelado). `{ success: true }` con 200; en el fallo,
 * `{ error, message }` con 400 y `error` en el conjunto cerrado
 * `INVALID_CODE` / `WEAK_PASSWORD`, que la móvil distingue. Códigos del
 * contrato: no se traducen.
 */
export async function POST(request: Request) {
  return proxyToBackend(request, "/auth/reset-password");
}
