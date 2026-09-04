import { proxyToBackend } from "@/lib/api/proxy";

/**
 * Catálogo de categorías activas → `GET /category`.
 *
 * Bloque A (contrato congelado). Array pelado de categorías activas con sus
 * `entities`.
 *
 * ⚠️ El backend reduce cada elemento de `entities` de la fila `Entity` entera a
 * siete campos. **No afecta a la móvil**: su tipo `Category`
 * (`core/types/index.ts:65-73`) ni siquiera declara `entities`, y
 * `useCategories.ts:10` solo pinta `id` y `name`.
 *
 * Las escrituras de esta ruta se retiraron el 02/09/2026. **No reponerlas.**
 */
export async function GET(request: Request) {
  return proxyToBackend(request, "/category");
}
