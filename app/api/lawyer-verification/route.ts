import { proxyToBackend } from "@/lib/api/proxy";

/**
 * Verificación contra el registro de la Rama Judicial (SIRNA) →
 * `POST /lawyer-verification`.
 *
 * Bloque B (solo web): `hooks/useLawyerRegistration.ts:161`. Mismo cuerpo
 * (`TipoDocumento`, `NumeroDocumento`, `Calidad`), misma respuesta
 * `{ isValid, data }` o `{ isValid, message }`, y **200**.
 *
 * ⚠️ **Quien llama al servicio del Estado pasa a ser el servidor**, con timeout
 * y con mensajes de un conjunto cerrado, y la ruta exige sesión. El original
 * reenviaba el error del servicio externo tal cual, con su texto incluido, y no
 * comprobaba nada.
 */
export async function POST(request: Request) {
  return proxyToBackend(request, "/lawyer-verification");
}
