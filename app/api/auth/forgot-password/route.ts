import { proxyToBackend } from "@/lib/api/proxy";

/**
 * Pedir el código de recuperación de seis dígitos → `POST /auth/forgot-password`.
 *
 * Bloque A (contrato congelado). El backend conserva lo que aquí era
 * deliberado: `{ success: true }` con **200 siempre**, exista o no el correo
 * (anti-enumeración), y `{ error: "INVALID_EMAIL", message }` con 400 cuando la
 * dirección no es válida. `INVALID_EMAIL` es una cadena del contrato, no un
 * texto de interfaz: no se traduce.
 *
 * ⚠️ Este flujo es el de la móvil (código de seis dígitos, `PasswordResetCode`).
 * El de la web —enlace por correo y `PasswordResetToken`— son acciones de
 * servidor (`actions/reset.ts`) y no pasa por aquí.
 */
export async function POST(request: Request) {
  return proxyToBackend(request, "/auth/forgot-password");
}
