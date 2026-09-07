import { proxyToBackend } from "@/lib/api/proxy";

/**
 * Proponer una entidad que falta en el catálogo → `POST /entity-suggestions`.
 *
 * Bloque B (solo web): el modal «no encuentro mi entidad» del selector,
 * `components/modals/entity-suggestion-modal.tsx:64`. Era uno de los cinco
 * huecos: el backend solo tenía `GET`/`PATCH` bajo `admin/`.
 *
 * Sigue **sin exigir sesión**, y es deliberado: quien no encuentra su entidad
 * puede no tener cuenta todavía, y el modal se abre desde el formulario público
 * de PQRSD. Misma respuesta —la sugerencia con `departmentName` y
 * `municipalityName`— y mismo **201**, y los mismos **404** cuando el
 * departamento no existe o el municipio no pertenece a ese departamento.
 *
 * ⚠️ Añade dos controles que aquí no había: techo de longitud del nombre y
 * límite de 10 altas por IP cada 15 minutos. El modal solo mira `response.ok`
 * y, si falla, `error.error`.
 *
 * ---
 * 🔴 **`GET /entity-suggestions` se retiró el 04/09/2026 (bloque C).** No lo
 * llamaba nadie: la revisión del buzón de sugerencias es del panel, que usa su
 * propia ruta contra `GET /admin/entity-suggestions`. Aquí era un listado
 * **sin sesión** de todas las sugerencias. No reponerlo.
 */
export async function POST(request: Request) {
  return proxyToBackend(request, "/entity-suggestions");
}
