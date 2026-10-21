/**
 * Piezas comunes del **enlace de la entidad** a su PQRSD (R-42): la página
 * `app/entidad/[token]`, su ruta de confirmación en `app/api` y lo que el
 * middleware y el layout raíz hacen distinto para ella.
 *
 * El enlace llega en el correo a la entidad como
 * `https://quejate.com.co/entidad/{token}`, y el token es la única credencial:
 * quien lo tiene lee la PQRSD con los datos de contacto del ciudadano y
 * confirma en nombre de la entidad. De ahí todo lo de este fichero: que la
 * dirección no salga de la página.
 *
 * Lo importan el middleware (edge) y un componente de cliente, así que aquí
 * solo hay constantes y funciones puras.
 */

/** Ruta de la página del enlace. */
const ENTITY_LINK_PATH = "/entidad";

/**
 * `true` en la página del enlace. El middleware le pone sus cabeceras y el
 * layout raíz no carga en ella Google Tag Manager.
 */
export function isEntityLinkPath(pathname: string): boolean {
  return (
    pathname === ENTITY_LINK_PATH ||
    pathname.startsWith(`${ENTITY_LINK_PATH}/`)
  );
}

/**
 * Cabeceras de la página y de su ruta de `app/api`.
 *
 * - `Referrer-Policy`: los adjuntos y el mapa son enlaces a otros sitios, y
 *   sin esto el navegador les mandaría la dirección completa, con el token.
 * - `X-Robots-Tag`: que ningún buscador la guarde aunque alguien la publique.
 * - `Cache-Control`: lleva datos personales del ciudadano; ninguna caché
 *   compartida la guarda.
 */
export const ENTITY_LINK_HEADERS: Readonly<Record<string, string>> = {
  "Referrer-Policy": "no-referrer",
  "X-Robots-Tag": "noindex, nofollow",
  "Cache-Control": "private, no-store",
};

/**
 * `true` si el token solo tiene caracteres de base64url.
 *
 * No es la regla del token, que vive en el backend
 * (`entity-link-token.ts`: 43 caracteres) y que da el 404. Es lo que hace
 * falta para interpolarlo en una ruta del backend sin que un `..` o un `.`
 * —que `encodeURIComponent` deja pasar— la saque de `/entity-links`.
 */
export function isBase64UrlToken(token: string): boolean {
  return /^[A-Za-z0-9_-]+$/.test(token);
}

/** Textos de error de la página, también los de la confirmación. */
export const ENTITY_LINK_MESSAGES = {
  notFound: "Este enlace no es válido o ya no está disponible.",
  rateLimited:
    "Demasiados intentos seguidos. Espere un minuto y vuelva a intentarlo.",
  loadFailed: "No se pudo cargar la PQRSD. Vuelva a intentarlo en unos minutos.",
  confirmFailed:
    "No se pudo guardar la confirmación. Vuelva a intentarlo en unos minutos.",
} as const;
