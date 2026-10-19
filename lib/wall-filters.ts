import { statusMap, typeMap } from "@/constants/pqrMaps";
import type { EntityFilterOption } from "@/components/filters/entity-filter";
import { normalizeSearchText, searchWall, type SearchablePqr } from "@/lib/wall-search";
import type { PQR } from "@/types/pqrsd";
import { formatText } from "@/utils/formatText";

/**
 * Si el muro enseña los cinco filtros (tipo, estado, entidad, ciudad y «Solo
 * vencidas») debajo de la caja de búsqueda.
 *
 * Apagado desde el 19/10/2026: la dirección del proyecto no les encontró
 * utilidad y decidió esconderlos sin borrar el código. Apagado, encima de la
 * lista solo queda la caja, `parseWallFilters` solo lee `q` (un enlace con
 * filtros abre el muro sin ellos) y una búsqueda no pide el catálogo de
 * entidades. Con `true` vuelven tal cual estaban en el PR #186.
 */
export const WALL_FILTERS_VISIBLE: boolean = false;

/**
 * Lo que se busca y se filtra en el muro. Con todo vacío, el muro es el de
 * siempre: la primera página del servidor y «Mostrar más».
 */
export interface WallFilters {
  /** Lo escrito en la caja, tal cual. Se normaliza al comparar. */
  text: string;
  type: PQR["type"] | null;
  status: PQR["status"] | null;
  entityId: string | null;
  /** El municipio de la entidad, que las PQRSD no traen: sale del catálogo. */
  municipalityId: string | null;
  /** `isOverdue === true`, la regla del servidor. */
  overdueOnly: boolean;
}

export const EMPTY_WALL_FILTERS: WallFilters = {
  text: "",
  type: null,
  status: null,
  entityId: null,
  municipalityId: null,
  overdueOnly: false,
};

/**
 * Nombre de cada filtro en la dirección, para que un enlace copiado abra el
 * muro con el mismo filtro: `/dashboard?q=basura&tipo=COMPLAINT&vencidas=1`.
 */
const PARAM = {
  text: "q",
  type: "tipo",
  status: "estado",
  entityId: "entidad",
  municipalityId: "ciudad",
  overdueOnly: "vencidas",
} as const;

type SearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | null {
  const single = Array.isArray(value) ? value[0] : value;
  return single ? single : null;
}

function oneOf<T extends string>(value: string | null, allowed: readonly T[]): T | null {
  return value !== null && (allowed as readonly string[]).includes(value) ? (value as T) : null;
}

/**
 * Los filtros que trae la dirección. Un tipo o un estado que no existe se
 * ignora; una entidad o una ciudad que no está en el muro se deja, y el muro
 * dirá que no hay resultados.
 *
 * Con los filtros escondidos solo se lee el texto: un enlace copiado con
 * filtros abriría un muro filtrado sin nada en pantalla que lo diga ni que
 * deje quitarlo. Al sincronizar la dirección, los demás parámetros se borran.
 */
export function parseWallFilters(params: SearchParams): WallFilters {
  const text = first(params[PARAM.text]) ?? "";
  if (!WALL_FILTERS_VISIBLE) return { ...EMPTY_WALL_FILTERS, text };

  return {
    text,
    type: oneOf(first(params[PARAM.type]), Object.keys(typeMap) as PQR["type"][]),
    status: oneOf(first(params[PARAM.status]), Object.keys(statusMap) as PQR["status"][]),
    entityId: first(params[PARAM.entityId]),
    municipalityId: first(params[PARAM.municipalityId]),
    overdueOnly: first(params[PARAM.overdueOnly]) === "1",
  };
}

/**
 * `search` (el `?…` de la dirección actual) con los filtros puestos. Los demás
 * parámetros se quedan como estaban.
 */
export function writeWallFilters(search: string, filters: WallFilters): string {
  const params = new URLSearchParams(search);
  const put = (key: string, value: string | null) => {
    if (value) params.set(key, value);
    else params.delete(key);
  };

  put(PARAM.text, normalizeSearchText(filters.text) ? filters.text.trim() : null);
  put(PARAM.type, filters.type);
  put(PARAM.status, filters.status);
  put(PARAM.entityId, filters.entityId);
  put(PARAM.municipalityId, filters.municipalityId);
  put(PARAM.overdueOnly, filters.overdueOnly ? "1" : null);

  const query = params.toString();
  return query ? `?${query}` : "";
}

export function hasWallFilters(filters: WallFilters): boolean {
  return (
    normalizeSearchText(filters.text) !== "" ||
    filters.type !== null ||
    filters.status !== null ||
    filters.entityId !== null ||
    filters.municipalityId !== null ||
    filters.overdueOnly
  );
}

/** El municipio de una entidad según el catálogo público (`GET /entities`). */
export interface EntityPlace {
  municipalityId: string;
  /** Como lo da el catálogo, en mayúsculas: «SANTA MARTA». */
  municipality: string;
  department: string | null;
}

/** Por `id` de entidad. Una entidad sin municipio no está. */
export type PlacesByEntity = Map<string, EntityPlace>;

/**
 * Las PQRSD de `rows` que pasan todos los filtros, en el orden en que venían.
 *
 * Una entidad sin municipio no entra en ningún filtro de ciudad.
 */
export function applyWallFilters(
  rows: SearchablePqr[],
  filters: WallFilters,
  places: PlacesByEntity,
): PQR[] {
  const kept = rows.filter(
    ({ pqr }) =>
      (filters.type === null || pqr.type === filters.type) &&
      (filters.status === null || pqr.status === filters.status) &&
      (filters.entityId === null || pqr.entity?.id === filters.entityId) &&
      (filters.municipalityId === null ||
        places.get(pqr.entity?.id)?.municipalityId === filters.municipalityId) &&
      (!filters.overdueOnly || pqr.isOverdue === true),
  );

  const term = normalizeSearchText(filters.text);
  return term ? searchWall(kept, term) : kept.map(({ pqr }) => pqr);
}

/**
 * Las ciudades de las PQRSD del muro, con cuántas hay de cada una. Se agrupa
 * por municipio y no por nombre: hay municipios que se llaman igual en dos
 * departamentos (Barbosa, en Antioquia y en Santander), y entonces se dice el
 * departamento al lado.
 */
export function cityFilterOptions(pqrs: PQR[], places: PlacesByEntity): EntityFilterOption[] {
  const byId = new Map<string, { place: EntityPlace; count: number }>();
  for (const pqr of pqrs) {
    const place = places.get(pqr.entity?.id);
    if (!place) continue;
    const option = byId.get(place.municipalityId);
    if (option) option.count += 1;
    else byId.set(place.municipalityId, { place, count: 1 });
  }

  const options = Array.from(byId.values(), ({ place, count }) => ({
    id: place.municipalityId,
    name: formatText(place.municipality),
    department: place.department,
    count,
  }));
  const seen = new Set<string>();
  const repeated = new Set<string>();
  for (const { name } of options) {
    if (seen.has(name)) repeated.add(name);
    seen.add(name);
  }

  return options
    .map(({ id, name, department, count }) => ({
      id,
      name: repeated.has(name) && department ? `${name} (${formatText(department)})` : name,
      count,
    }))
    .sort((a, b) => a.name.localeCompare(b.name, "es"));
}
