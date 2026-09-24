/**
 * Textos que acompañan a un documento legal recién generado. Están en un único
 * sitio para que cambiar una redacción sea cambiar una línea.
 */

/**
 * El backend no pudo guardar el documento —su guardado es *best effort*—: el
 * texto está en pantalla, pero no hay PDF ni quedará en el historial.
 *
 * Hay que decirlo. Un botón deshabilitado sin explicación no deja saber si la
 * plataforma está rota o si el ciudadano hizo algo mal; la app móvil llegó a
 * la misma conclusión con el mismo caso.
 */
export const LEGAL_DOC_NOT_SAVED_NOTICE =
  "No pudimos guardar este documento, así que esta vez no hay PDF. Copia el texto antes de cerrar esta ventana; si lo necesitas en PDF, vuelve a generarlo más tarde.";

/**
 * El backend respondió 404 al pedir el PDF: el documento caducó, o no existe,
 * o no es de quien lo pide. El backend no distingue los tres casos, a
 * propósito, así que el mensaje tampoco.
 */
export const LEGAL_DOC_UNAVAILABLE = "Este documento ya no está disponible.";
