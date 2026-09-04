import { proxyToBackend } from "@/lib/api/proxy";

/**
 * Darse de alta como abogado → `POST /lawyer/register`.
 *
 * Bloque A (contrato congelado). Devuelve la fila `Lawyer` creada con **200**
 * (`@HttpCode(OK)` explícito en el backend, que si no daría 201) y promueve al
 * usuario a `role: 'LAWYER'`, igual que aquí.
 *
 * Conserva los tres rechazos con 400 que la pantalla distingue por su texto:
 * falta el número de licencia, el usuario ya es abogado, y documento o licencia
 * ya registrados.
 */
export async function POST(request: Request) {
  return proxyToBackend(request, "/lawyer/register");
}
