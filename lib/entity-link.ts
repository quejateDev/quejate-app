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

/** `true` en la página del enlace: el layout raíz no carga en ella Google Tag Manager. */
export function isEntityLinkPath(pathname: string): boolean {
  return (
    pathname === ENTITY_LINK_PATH ||
    pathname.startsWith(`${ENTITY_LINK_PATH}/`)
  );
}
