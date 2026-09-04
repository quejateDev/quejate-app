import { proxyToBackend } from "@/lib/api/proxy";

/**
 * Municipios de un departamento → `GET /municipalities?departmentId=`.
 *
 * Bloque A (contrato congelado). Array pelado ordenado por nombre, con **400**
 * si falta `departmentId` y **404** si el departamento no existe. El parámetro
 * se reenvía tal cual, con el mismo nombre.
 *
 * ✅ Mismos ids que el catálogo de esta web; ver `regional-departments`.
 */
export async function GET(request: Request) {
  return proxyToBackend(request, "/municipalities");
}
