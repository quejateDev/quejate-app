import { proxyToBackend } from "@/lib/api/proxy";

/**
 * Revalidar la sesión de la app móvil en frío → `GET /auth/mobile/session`.
 *
 * Bloque A (contrato congelado). Devuelve `{ user }` con 200, o 401 sin sesión.
 *
 * 🔴 **Es la ruta que prueba el reenvío del `Bearer`.** La móvil llama aquí en
 * cada arranque (`AuthProvider.tsx:50`) y **solo** manda
 * `Authorization: Bearer`, nunca cookie: si el proxy no reenviara esa cabecera,
 * todos los teléfonos con sesión abierta recibirían 401 al abrir la app y el
 * interceptor de `client.ts:44-47` los echaría fuera.
 *
 * ⚠️ El `user` del backend es el `AuthUser` canónico y **siempre** trae
 * `entityId` e `isOAuth`; el de Next omitía `isOAuth` cuando la identidad venía
 * por Bearer (`lib/auth.ts:25-32`). Es un campo de más, no uno de menos: la
 * móvil lo lee con `?.` y no compara la forma.
 */
export async function GET(request: Request) {
  return proxyToBackend(request, "/auth/mobile/session");
}
