import { proxyToBackend } from "@/lib/api/proxy";

/**
 * Búsqueda de usuarios → `GET /users/search?q=`.
 *
 * Bloque B (solo web): `app/dashboard/users/page.tsx:34` y
 * `components/UserSearchCommand.tsx:51`. Array pelado de hasta 5
 * `{ id, name, role }`, y `[]` cuando no hay término.
 *
 * ⚠️ **H-17 sigue abierto y el repunte no lo cierra.** La búsqueda casa también
 * por correo, así que sin sesión confirma si una dirección está registrada y
 * con qué nombre: un oráculo de enumeración. El backend **replica** ese
 * comportamiento a propósito (paridad de contrato); cerrarlo es una decisión a
 * tomar allí, no un parche aquí.
 */
export async function GET(request: Request) {
  return proxyToBackend(request, "/users/search");
}
