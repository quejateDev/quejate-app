import { proxyToBackend } from "@/lib/api/proxy";

/**
 * Catálogo de entidades → `GET /entities`.
 *
 * Bloque A (contrato congelado). Array pelado, campo a campo el mismo:
 * `{ id, name, description, imageUrl, email, createdAt, municipalityId,
 * regionalDepartmentId, category { id, name }, _count { pqrs }, municipality,
 * department }`, con los filtros `categoryId`, `departmentId` y
 * `municipalityId` reenviados tal cual.
 *
 * Las escrituras de esta ruta se retiraron el 02/09/2026 por no comprobar
 * sesión. **No reponerlas aquí**: la administración de catálogos vive en el
 * backend, bajo `admin/`.
 */
export async function GET(request: Request) {
  return proxyToBackend(request, "/entities");
}
