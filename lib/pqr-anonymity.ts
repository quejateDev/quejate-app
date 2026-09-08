/**
 * Oculta el autor de una PQRSD **anónima** en las páginas de servidor de esta
 * web (**H-18**).
 *
 * ## Por qué existe una copia aquí
 *
 * El backend unificado ya aplica esta regla en `src/pqr/anonymity.ts`, y todas
 * las rutas de `app/api/` la heredan desde el repunte. Pero **las páginas de
 * servidor de esta web no pasan por ahí**: leen Prisma directamente, así que
 * ninguna la recibió. El muro (`app/dashboard/page.tsx`) y el mapa
 * (`app/dashboard/mapa/page.tsx`) seguían publicando `creator` en las PQRSD
 * anónimas.
 *
 * Esta copia es deliberadamente **una sola** y compartida por las dos páginas.
 * Tener la regla escrita dos veces —una por página— es exactamente la figura
 * que dejó la web sin el arreglo del backend, y no se repite aquí dentro.
 *
 * ## La regla, idéntica a la del backend
 *
 * - No es anónima → el `creator` va como siempre.
 * - Es anónima y quien mira es el autor → el `creator` va como siempre.
 * - Cualquier otro caso → `creator: null` **y `creatorId: null`**.
 *
 * 🔑 **Se ocultan los dos campos, no uno.** Sin nulificar el escalar el arreglo
 * no aguanta un segundo intento: `GET /users/:id` responde **sin sesión** con
 * el nombre y la imagen, así que dejar el `creatorId` en el muro sería
 * publicar el autor anónimo a una petición de distancia. Es la misma razón, y
 * la misma decisión, que la documentada en `anonymity.ts:60-71` del backend.
 *
 * ⚠️ Ninguna de las dos páginas **pinta** hoy el autor de una PQRSD anónima:
 * `PQRCardHeader.tsx:112` y `MapaCiudadano.tsx:219` ya escriben «Anónimo». El
 * dato viajaba igual, porque las dos páginas pasan las filas de Prisma a un
 * componente de cliente y Next las serializa enteras en la carga de la página.
 * Que la interfaz lo tape no es que el dato no salga.
 */

/** Lo mínimo que hay que traer del `select` para poder decidir. */
export interface AnonymizablePqr {
  anonymous: boolean;
  creatorId?: string | null;
  creator: unknown;
}

/**
 * @param pqr - La PQRSD tal como sale del `select` de Prisma.
 * @param viewerId - `id` de la sesión, o `null`/`undefined` si no hay sesión o
 *   si en esa superficie no hay forma de ser el autor. El mapa no lo pasa: su
 *   ventana emergente escribe «Anónimo» para cualquiera, también para el
 *   propio autor, así que la excepción de autoría no cambiaría nada allí y
 *   pedir la sesión solo para descartarla sería ruido.
 * @returns La misma fila, o una copia con `creator` y `creatorId` a `null`.
 *   **No muta** la entrada.
 */
export function hideAnonymousCreator<T extends AnonymizablePqr>(
  pqr: T,
  viewerId?: string | null,
): T {
  // Se evalúa ANTES de vaciar nada: lee `creatorId`, que es uno de los dos
  // campos que esta función pone a `null`. Y el `!= null` no es defensivo:
  // `PQRS.creator` es `SetNull`, así que una PQRSD huérfana de un usuario
  // borrado lo tiene a `null` y sin la guarda casaría con una sesión sin id.
  const isAuthor =
    viewerId != null && pqr.creatorId != null && pqr.creatorId === viewerId;

  if (!pqr.anonymous || isAuthor) {
    return pqr;
  }
  return { ...pqr, creator: null, creatorId: null };
}
