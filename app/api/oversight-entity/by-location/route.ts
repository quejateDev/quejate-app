import { proxyToBackend } from "@/lib/api/proxy";

/**
 * Entes de control de una ubicación →
 * `GET /oversight-entity/by-location?regionalDepartmentId=&municipalityId=`.
 *
 * Bloque B (solo web):
 * `components/pqr/follow-up/services/pqrFollowUpService.ts:17`. Era otro de los
 * cinco huecos; el backend no tenía módulo `oversight` y ahora sí.
 *
 * Misma forma y mismo criterio de selección: con `municipalityId` devuelve los
 * del municipio **y** los departamentales; sin él, solo los departamentales.
 * Mismo orden y mismo **400** si falta `regionalDepartmentId`. Se conserva la
 * capitalización `Municipality` / `RegionalDepartment`, que es lo que leen
 * `OversightEntityListView.tsx:152,153` y `usePQRFollowUp.ts:214,215`.
 *
 * ⚠️ El backend usa `select` donde aquí había `include`. Hoy la única
 * diferencia son `createdAt` y `updatedAt`, que no pinta nadie.
 */
export async function GET(request: Request) {
  return proxyToBackend(request, "/oversight-entity/by-location");
}
