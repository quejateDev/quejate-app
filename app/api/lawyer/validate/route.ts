import { proxyToBackend } from "@/lib/api/proxy";

/**
 * Documento o licencia ya registrados → `POST /lawyer/validate`.
 *
 * Bloque B (solo web): `hooks/useLawyerRegistration.ts:61`. Misma respuesta
 * `{ existsIdentity, existsLicense }` con **200** y el mismo 400 cuando no
 * llega ninguno de los dos.
 *
 * 🔴 **El backend exige sesión, y aquí no la había.** Sin ella era un oráculo:
 * alimentándolo con una lista de cédulas se averiguaba cuáles pertenecen a
 * abogados de la plataforma, sin autenticarse. No rompe el flujo — para
 * registrarse como abogado hay que haber entrado — y añade un límite de 20/min.
 */
export async function POST(request: Request) {
  return proxyToBackend(request, "/lawyer/validate");
}
