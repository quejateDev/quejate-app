import { cookies, headers } from "next/headers";

/**
 * Cliente **de servidor** contra el backend unificado (`quejate-backend`).
 *
 * Copiado de `quejate-admin-panel/lib/api/backend.ts` (Tarea 15), que lleva en
 * producción desde el 01/09/2026, **con una sola diferencia**: aquí la
 * identidad puede llegar por **dos** vías y hay que reenviar las dos. Ver
 * «Cómo viaja la identidad».
 *
 * Todo lo que la web hable con el backend pasa por aquí: las rutas de
 * `app/api/*`, que dejan de hablar con Prisma y reenvían al backend.
 *
 * ## Cómo viaja la identidad, que es lo único que importa de este fichero
 *
 * El backend valida **el mismo JWE** que emite el Auth.js de esta web:
 * comparten `AUTH_SECRET`, y `JweAuthGuard` lee **primero la cookie** de sesión
 * —cuyo nombre es el `AUTH_SALT`— y **luego** el `Authorization: Bearer`.
 *
 * 🔴 **Y aquí llegan los dos.** A diferencia del panel, esta web es también el
 * backend de la app móvil publicada, que apunta a
 * `https://www.quejate.com.co/api` con esa URL **compilada en el binario** y se
 * autentica **siempre por `Authorization: Bearer`** (el interceptor de
 * `core/api/client.ts`). El navegador, en cambio, va por cookie, porque
 * `SameSite=Lax` no la manda a otro sitio.
 *
 * Así que se reenvían **las dos cabeceras, cada una tal cual llegó**, y el
 * guard del backend escoge. Reenviar solo la cookie dejaría a la móvil sin
 * sesión en todas las rutas del contrato congelado que la exigen; reenviar solo
 * el Bearer, a la web.
 *
 * 🔴 **No hay credencial de servicio, y es deliberado.** Si la web se
 * autenticara con una cuenta técnica, todas las peticiones llegarían al backend
 * como el mismo usuario y el backend dejaría de poder distinguir quién
 * pregunta: se caerían de golpe la propiedad de la PQRSD, el `isOwner` del
 * anonimato (H-18) y el aislamiento por entidad. Cada petición llega con el
 * usuario real.
 *
 * ## Por qué se reenvía la cabecera `Cookie` entera y no se compone
 *
 * El nombre de la cookie **cambia con el esquema**: Auth.js antepone
 * `__Secure-` solo sobre HTTPS, así que en producción es
 * `__Secure-authjs.session-token` y en local `authjs.session-token`. Reenviando
 * lo que el navegador mandó, la web no tiene que saber en cuál de los dos
 * entornos corre — y el backend, que sí lo sabe por su `AUTH_SALT`, escoge.
 * Adivinar el nombre aquí es exactamente el patrón que costó **A-02** y
 * **A-03**, y el que `lib/auth.ts:5-8` todavía arrastra. No lo "mejores".
 */

/** Base del backend unificado. En local, el `PORT` por defecto de Nest. */
const BACKEND_URL = (
  process.env.BACKEND_API_URL ?? "http://localhost:3001"
).replace(/\/$/, "");

/**
 * Prefijo global del backend. `configureApp` monta todo bajo `/api`, así que
 * `/pqr` se sirve en `/api/pqr`.
 */
const BACKEND_PREFIX = "/api";

/** Cabeceras que NO se reenvían al backend aunque vengan en la petición. */
const HOP_BY_HOP = new Set([
  "host",
  "connection",
  "content-length",
  "transfer-encoding",
  "accept-encoding",
]);

/**
 * Cabecera `Cookie` de la petición en curso.
 *
 * Sirve tanto en una ruta de `app/api/*` como en un componente de servidor: en
 * los dos casos `cookies()` devuelve el tarro de la petición entrante.
 */
export async function sessionCookieHeader(): Promise<string> {
  return (await cookies()).toString();
}

/**
 * Cabecera `Authorization` de la petición en curso, si la hay.
 *
 * El equivalente de {@link sessionCookieHeader} para el otro cliente: la móvil
 * no manda cookie, manda `Bearer <JWE>`. `headers()` la expone igual.
 */
export async function sessionAuthorizationHeader(): Promise<string> {
  return (await headers()).get("authorization") ?? "";
}

/** Opciones de {@link backendFetch}. */
export interface BackendFetchOptions {
  method?: string;
  /** Cuerpo ya serializado, o un `FormData`/stream para multipart. */
  body?: BodyInit | null;
  /** Query a añadir. Los valores `undefined` o vacíos se omiten. */
  searchParams?: URLSearchParams | Record<string, string | undefined>;
  /**
   * Cabecera `Cookie` a reenviar. Por defecto, la de la petición en curso.
   * Las rutas de `app/api/*` pasan la del `Request` que reciben.
   */
  cookie?: string;
  /**
   * Cabecera `Authorization` a reenviar. Por defecto, la de la petición en
   * curso. Es la vía de la app móvil publicada; ver la cabecera del fichero.
   */
  authorization?: string;
  /** Cabeceras extra (`content-type`, típicamente). */
  headers?: Record<string, string>;
  /** `no-store` por defecto: la caché la decide el backend con sus cabeceras. */
  cache?: RequestCache;
}

/**
 * Llama al backend unificado con la identidad del usuario de la petición.
 *
 * @param path - Ruta **sin** el prefijo `/api` (p. ej. `/pqr`). Siempre una
 *   constante del código; nunca un valor que venga del cliente, para que no
 *   haya forma de apuntar la web a otro host (SSRF, OWASP API7). Los segmentos
 *   variables van codificados por quien llama.
 */
export async function backendFetch(
  path: string,
  options: BackendFetchOptions = {},
): Promise<Response> {
  const url = new URL(`${BACKEND_URL}${BACKEND_PREFIX}${path}`);

  if (options.searchParams instanceof URLSearchParams) {
    url.search = options.searchParams.toString();
  } else if (options.searchParams) {
    for (const [key, value] of Object.entries(options.searchParams)) {
      if (value !== undefined && value !== "") {
        url.searchParams.set(key, value);
      }
    }
  }

  const outgoing = new Headers(options.headers);

  // Las dos credenciales, por separado y explícitas: el backend elige cuál
  // usar. Se fijan DESPUÉS de `options.headers` para que el reenvío en bloque
  // de `forwardableHeaders` no pueda dejarse una por el camino.
  const cookie = options.cookie ?? (await sessionCookieHeader());
  if (cookie) {
    outgoing.set("cookie", cookie);
  }

  const authorization =
    options.authorization ?? (await sessionAuthorizationHeader());
  if (authorization) {
    outgoing.set("authorization", authorization);
  }

  return fetch(url, {
    method: options.method ?? "GET",
    body: options.body ?? undefined,
    headers: outgoing,
    cache: options.cache ?? "no-store",
    // Necesario cuando `body` es un stream: la subida de ficheros y el
    // `multipart` de radicar una PQRSD.
    ...(options.body instanceof ReadableStream ? { duplex: "half" } : {}),
  } as RequestInit);
}

/**
 * Lo mismo, devolviendo ya el JSON tipado.
 *
 * @throws {BackendError} si el backend no responde 2xx. Los componentes de
 *   servidor lo dejan subir: un fallo de datos debe romper la página, no
 *   pintarla a medias (el modo de fallo de A-12).
 */
export async function backendJson<T>(
  path: string,
  options: BackendFetchOptions = {},
): Promise<T> {
  const response = await backendFetch(path, options);
  if (!response.ok) {
    throw await BackendError.from(response, path);
  }
  return (await response.json()) as T;
}

/**
 * Igual que {@link backendJson}, pero devuelve `null` en un 404 en vez de
 * lanzar. Para las páginas que responden `notFound()` a un recurso ausente.
 */
export async function backendJsonOrNull<T>(
  path: string,
  options: BackendFetchOptions = {},
): Promise<T | null> {
  const response = await backendFetch(path, options);
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw await BackendError.from(response, path);
  }
  return (await response.json()) as T;
}

/** Error del backend con su estado, para que quien llama decida qué pintar. */
export class BackendError extends Error {
  constructor(
    readonly status: number,
    readonly path: string,
    message: string,
  ) {
    super(message);
    this.name = "BackendError";
  }

  static async from(response: Response, path: string): Promise<BackendError> {
    // El contrato de error del backend es `{ error, details?, code? }`.
    const detail = await response
      .clone()
      .json()
      .then((body: unknown) =>
        typeof body === "object" && body !== null && "error" in body
          ? String((body as { error: unknown }).error)
          : response.statusText,
      )
      .catch(() => response.statusText);

    return new BackendError(
      response.status,
      path,
      `${response.status} en ${path}: ${detail}`,
    );
  }
}

/**
 * Cabeceras a reenviar de la petición del cliente hacia el backend.
 *
 * Reenvía todo lo que no sea salto-a-salto, y eso **incluye `cookie` y
 * `authorization`**: por aquí pasan los dos clientes. {@link backendFetch} las
 * vuelve a fijar explícitamente, para que ninguna de las dos dependa de que
 * esta lista siga siendo la que es hoy.
 */
export function forwardableHeaders(request: Request): Record<string, string> {
  const headers: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    if (!HOP_BY_HOP.has(key.toLowerCase())) {
      headers[key] = value;
    }
  });
  return headers;
}
