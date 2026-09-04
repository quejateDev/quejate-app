import { proxyToBackend } from "@/lib/api/proxy";

/**
 * Una entidad → `GET /entities/:id`.
 *
 * Bloque A (contrato congelado). Misma forma, incluida la capitalización
 * heredada de Prisma `RegionalDepartment` / `Municipality`, y `pqrConfig` con
 * sus `customFields`. 404 si no existe o está inactiva.
 *
 * ⚠️ El cuerpo del 404 pasa de texto plano (`new NextResponse("Entity not
 * found")`) al `{ error }` del backend. Ningún cliente lee ese cuerpo: la móvil
 * solo mira el estado (`usePQRConfig.ts:10` sobre `apiClient`, que lanza en
 * cualquier no-2xx).
 */
export async function GET(request: Request, { params }: any) {
  const { id } = await params;
  return proxyToBackend(request, `/entities/${encodeURIComponent(id)}`);
}
