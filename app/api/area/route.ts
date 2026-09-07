import { proxyToBackend } from "@/lib/api/proxy";

/**
 * Catálogo público de áreas → `GET /area`.
 *
 * Bloque B (solo web), pero es **el hueco que mandaba** de los cinco: lo
 * consume `hooks/usePQRForm.ts:94`, o sea el formulario ciudadano de radicar
 * PQRSD. El backend solo tenía `GET /admin/areas`, con sesión y alcance por
 * entidad; sin un listado público, el formulario central del producto dejaba de
 * funcionar. Se añadió `GET /area` allí.
 *
 * 🔴 **Y se añadió con el `select` de H-15, que hay que respetar.** El
 * manejador original respondía, **sin sesión de ningún tipo**, con el `include`
 * de `entity`, `employees` y `pqrs`: de cada empleado el hash bcrypt de su
 * contraseña, su correo, su teléfono y su `pushToken`; de cada PQRSD la fila
 * entera **sin filtrar por `private`**. Y sin `where`, las de todas las
 * entidades. Se cerró aquí el 02/09/2026 dejando `id`, `name` y `entityId`, y
 * el backend sirve exactamente esos tres campos. Servir la forma antigua
 * reabre el agujero.
 *
 * ⚠️ Deuda conocida que el repunte no toca:
 * `services/api/Department.service.ts:13-20` sigue tipando la respuesta como
 * `DepartmentWithRelations`. El tipo es una promesa falsa desde el arreglo de
 * H-15; nadie lo usa para pintar.
 */
export async function GET(request: Request) {
  return proxyToBackend(request, "/area");
}
