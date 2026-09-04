import { proxyToBackend } from "@/lib/api/proxy";

/**
 * Entrar con correo y contraseña desde la app móvil → `POST /auth/mobile/credentials`.
 *
 * Bloque A (contrato congelado). El backend responde la misma forma
 * —`{ sessionToken, user: { id, name, email, image, role, entityId, isOAuth } }`—
 * y con **200 explícito** (`@HttpCode(200)`), que es lo que daba Next.
 * Conserva también los tres estados de rechazo que la móvil distingue: 400
 * campos inválidos, 401 credenciales o correo sin verificar, 403 cuenta
 * desactivada.
 *
 * 🔑 **El `sessionToken` sigue siendo el mismo JWE.** El backend lo emite con
 * `encode` de `@auth/core/jwt`, mismo `AUTH_SECRET`, mismo salt
 * (`__Secure-authjs.session-token`) y los mismos 30 días, con un *fixture*
 * dorado en CI que rompe si deja de decodificar los del emisor viejo. Los
 * tokens que hay hoy en los teléfonos **siguen valiendo**.
 *
 * ⚠️ Añade un 429 por IP y por correo que aquí no existía. Es un estado nuevo,
 * no un cambio de forma: la móvil lo recoge en su `catch` genérico.
 */
export async function POST(request: Request) {
  return proxyToBackend(request, "/auth/mobile/credentials");
}
