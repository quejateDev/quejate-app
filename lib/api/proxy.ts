import { NextResponse } from "next/server";
import { backendFetch, forwardableHeaders } from "./backend";

/**
 * Reenvío de una ruta `app/api/*` de la web al backend unificado.
 *
 * Copiado de `quejate-admin-panel/lib/api/proxy.ts` (Tarea 15) con las
 * diferencias que impone tener **dos** clientes en vez de uno; están marcadas
 * abajo una por una.
 *
 * ## Por qué la web conserva su superficie `/api/*` en vez de que el cliente
 * llame al backend directamente
 *
 * 1. 🔴 **La app móvil publicada no se puede repuntar.** Su URL base va
 *    compilada en el binario que la gente ya tiene instalado. Mientras exista
 *    un teléfono con la versión de hoy, `https://www.quejate.com.co/api` tiene
 *    que seguir contestando. Esta es la razón que manda sobre las otras dos.
 * 2. **La cookie de sesión no viaja entre sitios.** Auth.js la emite con
 *    `SameSite=Lax`, así que el navegador **no** la adjunta a un `fetch` hacia
 *    otro sitio. La web está en Vercel y el backend en Render
 *    (`api.quejate.com.co`): llamar directo exigiría bajar la cookie a
 *    `SameSite=None`, que es debilitar la defensa contra CSRF de toda la
 *    plataforma para ahorrarse un salto.
 * 3. **La reversión es de una línea por ruta.** El contrato que el cliente ve
 *    no cambia, así que volver a Prisma en una ruta concreta —si algo saliera
 *    mal en el despliegue— es restaurar ese fichero, sin tocar la interfaz.
 *
 * ## Qué NO hace este proxy
 *
 * No traduce cuerpos. Donde el contrato nuevo cambió a propósito —un campo que
 * se retira porque nadie lo lee, un `403` donde había un `500`— **se deja pasar
 * la respuesta del backend**. Un adaptador que finge la forma vieja es una
 * copia que envejece, y esa es exactamente la figura de A-16.
 *
 * ⚠️ **Lo único que sí traduce es el `status`, y solo donde se pidió por
 * escrito**: `POST /pqr` y `POST /push-token` daban **200** en Next y Nest da
 * **201**. Ningún cliente mira ese status, pero la paridad estricta cuesta una
 * línea y elimina la duda (§3 del brief de la Tarea 13). Se hace con
 * {@link ProxyOptions.statusMap}, ruta por ruta y de forma visible, nunca
 * global: un `201 → 200` automático escondería el día que una ruta nueva
 * empiece a crear recursos.
 */

/** Métodos que llevan cuerpo. */
const METHODS_WITH_BODY = new Set(["POST", "PUT", "PATCH", "DELETE"]);

/** Opciones de {@link proxyToBackend}. */
export interface ProxyOptions {
  /**
   * Qué hacer con la query de la petición entrante:
   * - `"forward"` (por defecto) — se reenvía tal cual.
   * - `"drop"` — no se reenvía (el valor ya viajó al path).
   * - Un `URLSearchParams` — se reenvía ese, ya compuesto por quien llama.
   */
  searchParams?: "forward" | "drop" | URLSearchParams;
  /**
   * Traducción de estados de la respuesta del backend, `{ recibido: emitido }`.
   * Solo para conservar el contrato congelado de la móvil; ver la cabecera.
   */
  statusMap?: Readonly<Record<number, number>>;
  /**
   * Reenviar la cabecera `Cache-Control` del backend.
   *
   * Por defecto **no**, igual que el panel: el manejador de Next que se
   * sustituye no emitía ninguna, y añadirla sería un cambio de comportamiento
   * en clientes que no se pueden parchear. Se activa solo donde la cabecera
   * **ya forma parte del contrato de hoy** — hoy, únicamente
   * `GET /users/:id`, con su `private, max-age=60`.
   */
  forwardCacheControl?: boolean;
}

/**
 * Reenvía la petición al backend conservando la identidad del usuario.
 *
 * @param request - La petición que recibió la ruta de la web.
 * @param path - Ruta del backend **sin** el prefijo `/api`. Es siempre una
 *   constante del código: los segmentos variables se interpolan ya codificados
 *   por quien llama, nunca se toma un host ni una ruta del cliente (API7).
 */
export async function proxyToBackend(
  request: Request,
  path: string,
  options: ProxyOptions = {},
): Promise<NextResponse> {
  const method = request.method.toUpperCase();

  const searchParams =
    options.searchParams instanceof URLSearchParams
      ? options.searchParams
      : options.searchParams === "drop"
        ? new URLSearchParams()
        : new URL(request.url).searchParams;

  const response = await backendFetch(path, {
    method,
    searchParams,
    // Las credenciales de ESTA petición, las dos: la cookie del navegador de
    // un ciudadano y/o el `Bearer` del teléfono. No son credenciales del
    // servidor. Se pasan explícitas —y no solo dentro de
    // `forwardableHeaders`— porque de ellas depende que cada cliente siga
    // teniendo sesión después del repunte.
    cookie: request.headers.get("cookie") ?? "",
    authorization: request.headers.get("authorization") ?? "",
    headers: forwardableHeaders(request),
    // El cuerpo se pasa como stream: una PQRSD con adjuntos no se materializa
    // en memoria del servidor de Next solo para volver a enviarla.
    body: METHODS_WITH_BODY.has(method) ? request.body : null,
  });

  return mirror(response, options);
}

/**
 * Devuelve al cliente la respuesta del backend con su estado y su cuerpo.
 *
 * Se copia el estado tal cual —incluidos `403`, `409` y `429`— salvo la
 * traducción explícita de {@link ProxyOptions.statusMap}. `Set-Cookie` **no**
 * se propaga: la sesión del navegador la gobierna el Auth.js de esta web, cuyo
 * *catch-all* (`/api/auth/[...nextauth]`) no se repunta, y ninguna de las rutas
 * proxiadas emite cookies.
 */
async function mirror(
  response: Response,
  options: ProxyOptions,
): Promise<NextResponse> {
  const body = await response.arrayBuffer();
  const headers = new Headers();

  const contentType = response.headers.get("content-type");
  if (contentType) {
    headers.set("content-type", contentType);
  }

  if (options.forwardCacheControl) {
    const cacheControl = response.headers.get("cache-control");
    if (cacheControl) {
      headers.set("cache-control", cacheControl);
    }
  }

  const status = options.statusMap?.[response.status] ?? response.status;

  return new NextResponse(body.byteLength > 0 ? body : null, {
    status,
    headers,
  });
}
