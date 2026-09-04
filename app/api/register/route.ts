import { proxyToBackend } from "@/lib/api/proxy";

/**
 * Alta de una cuenta ciudadana → `POST /register`.
 *
 * Bloque A (contrato congelado). Devuelve
 * `{ success: "Se ha enviado un correo de verificación" }` con **201**, igual
 * que aquí, y conserva los dos fallos que los clientes distinguen:
 *
 * - **400** `{ error: "Campos inválidos", details }` de la validación.
 * - 🔴 **409** `{ error }` cuando el correo ya está en uso. `useRegister.ts` de
 *   la móvil mira ese estado concreto para decir «ya tienes cuenta» en vez de
 *   un error genérico; si se perdiera, el mensaje cambiaría en un binario que
 *   no se puede parchear.
 */
export async function POST(request: Request) {
  return proxyToBackend(request, "/register");
}
