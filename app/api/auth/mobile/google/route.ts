import { proxyToBackend } from "@/lib/api/proxy";

/**
 * Entrar con Google desde la app móvil → `POST /auth/mobile/google`.
 *
 * Bloque A (contrato congelado). Misma forma que `mobile/credentials` con
 * `isOAuth: true`, y **200 explícito** en el backend. Añade 429, igual que la
 * anterior.
 */
export async function POST(request: Request) {
  return proxyToBackend(request, "/auth/mobile/google");
}
