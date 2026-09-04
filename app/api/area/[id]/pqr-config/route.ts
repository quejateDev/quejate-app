import { proxyToBackend } from "@/lib/api/proxy";

/**
 * Configuración de PQRSD de un área → `GET /area/:id/pqr-config`.
 *
 * La usan los **dos** clientes: el formulario de radicar de la web
 * (`usePQRForm.ts:131`) y el de la móvil (`useAreaPQRConfig.ts:18`). Pública en
 * los dos lados, porque el formulario se rellena antes de que haya sesión.
 *
 * ⚠️ **El caso que hay que no romper es el área sin configuración.** Aquí se
 * respondía `NextResponse.json(null)`: cuerpo `null` con 200, no cuerpo vacío.
 * Los dos clientes llaman a `response.json()` sin comprobar nada, así que un
 * cuerpo vacío los haría lanzar. El backend usa `@Res` a propósito para emitir
 * el `null` literal.
 *
 * ⚠️ No confundir con `GET|PUT /admin/areas/:id/pqr-config`, que es la de
 * administración y sí lleva guards.
 */
export async function GET(request: Request, { params }: any) {
  const { id } = await params;
  return proxyToBackend(request, `/area/${encodeURIComponent(id)}/pqr-config`);
}
