import { proxyToBackend } from "@/lib/api/proxy";

/**
 * Departamentos de Colombia → `GET /regional-departments`.
 *
 * Bloque A (contrato congelado). Array pelado ordenado por nombre.
 *
 * ✅ **Los ids son los mismos.** Era el riesgo A-12 de esta ruta: la web los
 * servía desde `data/colombia-geo.json` y el backend desde el suyo, y unos ids
 * distintos dejarían los selectores de la móvil **vacíos sin ningún error
 * visible**. Comparado el 24/08/2026 contra las dos fuentes y repetido contra
 * producción: 33 departamentos y 1.123 municipios, mismos ids, mismos nombres,
 * cero discrepancias. Además ningún repositorio escribe nunca en esas tablas,
 * así que no pueden derivar.
 */
export async function GET(request: Request) {
  return proxyToBackend(request, "/regional-departments");
}
