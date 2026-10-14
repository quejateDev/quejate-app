import type { PQR } from "@/types/pqrsd";

// Copia de la regla del buscador del muro de la app móvil
// (`quejate-mobile-app/src/features/pqr/utils/wallSearch.ts`, `e9700c5`). Las
// dos tienen que encontrar lo mismo con el mismo texto: si se cambia una, se
// cambia la otra, y sus pruebas viven allí.

/**
 * Deja un texto listo para comparar: sin tildes, sin mayúsculas y con los
 * espacios recogidos. «Basúra», «BASURA» y « basura » quedan en «basura».
 *
 * La tilde se quita separando cada letra de su marca (NFD) y tirando la marca,
 * y con ella cae la diéresis. La ñ no cae: es otra letra, y sin ella «año»
 * casaría con «ciudadano». Se conserva venga como venga: de una pieza, como «n»
 * más su virgulilla (U+0303) o en mayúscula.
 *
 * Que «senal» encuentre «señal» no sale de aquí: lo decide la comparación, en
 * `searchWall`.
 */
export function normalizeSearchText(text: string): string {
  return text
    .normalize("NFD")
    .toLowerCase()
    // Antes de tirar las marcas: la virgulilla de la ñ es una de ellas.
    .replace(/n\u0303/g, "ñ")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Lo que el buscador del muro lee de una PQRSD, ya normalizado: el asunto, la
 * descripción y el nombre de la entidad.
 *
 * La lista es cerrada a propósito. No entra `creator` ni nada que identifique a
 * quien radicó (H-18): una PQRSD anónima no puede salir al buscar el nombre de
 * su autor. Hoy el servidor vacía `creator` en las anónimas salvo para el
 * propio autor, pero el buscador no puede depender de que ese campo llegue
 * vacío.
 *
 * Cada campo va en su línea. El texto que se busca nunca lleva saltos de línea
 * (`normalizeSearchText` los recoge), así que nada casa a caballo entre el
 * final de un campo y el principio del siguiente.
 */
export function wallSearchText(pqr: PQR): string {
  return [pqr.subject, pqr.description, pqr.entity?.name]
    .map((field) => normalizeSearchText(field ?? ""))
    .join("\n");
}

/**
 * Una PQRSD con su texto preparado para buscar en él. Se prepara una vez por
 * lista, no en cada tecla.
 */
export interface SearchablePqr {
  pqr: PQR;
  /** Su `wallSearchText`, con cada ñ en su sitio. */
  text: string;
  /**
   * El mismo texto con cada ñ vuelta «n». El cambio es letra por letra, así que
   * lo que ocupa un puesto en `plain` ocupa el mismo en `text`.
   */
  plain: string;
}

function withoutEnye(text: string): string {
  return text.replace(/ñ/g, "n");
}

export function toSearchable(pqr: PQR): SearchablePqr {
  const text = wallSearchText(pqr);
  return { pqr, text, plain: withoutEnye(text) };
}

/**
 * Las PQRSD en las que aparece `term`, que tiene que venir de
 * `normalizeSearchText`.
 *
 * Con la ñ la comparación no vale igual en los dos sentidos:
 * - La «n» que se escribe vale por «n» y por «ñ». «senal» encuentra «señal» y
 *   «dano» encuentra «daño»: no todo el mundo tiene la ñ a mano.
 * - La «ñ» que se escribe solo vale por «ñ». «daño» no encuentra «ciudadano»,
 *   ni «año» encuentra «urbano».
 *
 * Por eso se busca lo escrito sin sus ñ en el texto sin las suyas, y cada sitio
 * donde aparece solo cuenta si el texto lleva ñ donde lo escrito la lleva.
 */
export function searchWall(rows: SearchablePqr[], term: string): PQR[] {
  const plainTerm = withoutEnye(term);
  const enyeAt: number[] = [];
  for (let i = 0; i < term.length; i++) {
    if (term[i] === "ñ") enyeAt.push(i);
  }

  const found = ({ text, plain }: SearchablePqr): boolean => {
    let at = plain.indexOf(plainTerm);
    while (at !== -1) {
      if (enyeAt.every((i) => text[at + i] === "ñ")) return true;
      at = plain.indexOf(plainTerm, at + 1);
    }
    return false;
  };

  return rows.filter(found).map((row) => row.pqr);
}
