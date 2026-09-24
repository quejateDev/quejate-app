/**
 * Textos que acompañan a un documento legal recién generado. Están en un único
 * sitio para que cambiar una redacción sea cambiar una línea.
 */

/**
 * El documento es un borrador y la plataforma no responde por su contenido.
 *
 * Decisión de dirección. Hasta que se añadió, ninguna frase de este flujo lo
 * decía: el ciudadano recibía un escrito generado por IA con aspecto de
 * definitivo.
 */
export const LEGAL_DOC_DRAFT_NOTICE =
  "Es un borrador redactado con inteligencia artificial: revísalo y corrígelo antes de presentarlo. Quéjate no se hace responsable de su contenido.";

/**
 * Cuánto se guarda: seis meses, y después se borra (decisión de dirección del
 * 21/09/2026, con un abogado).
 *
 * **Mismo texto que la app móvil** (`src/features/pqr/utils/legalDocsCopy.ts`
 * en `quejate-mobile-app`), para que los dos clientes prometan lo mismo. Si el
 * plazo cambia, cambia aquí, allí y en los términos.
 */
export const LEGAL_DOC_RETENTION_NOTICE =
  "Guardamos este documento seis meses para que puedas volver a descargarlo. Después se borra.";

/**
 * El mismo plazo, dicho sobre el historial entero. En plural sin mentir: desde
 * la Tarea 27 el historial trae tutelas **y** oficios a entes de control.
 */
export const LEGAL_DOCS_HISTORY_RETENTION_NOTICE =
  "Guardamos tus documentos seis meses desde que los generas, para que puedas volver a descargarlos. Después se borran.";

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
