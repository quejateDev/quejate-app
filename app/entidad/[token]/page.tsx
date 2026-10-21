import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Logo } from "@/components/Logo";
import {
  EntityLinkConfirmation,
  type EntityLinkConfirmationState,
} from "@/components/pqr/entity-link-confirmation";
import { statusMap, typeMap } from "@/constants/pqrMaps";
import { backendFetch } from "@/lib/api/backend";
import { formatDate, formatDateWithoutTime } from "@/lib/dateUtils";
import { ENTITY_LINK_MESSAGES, isBase64UrlToken } from "@/lib/entity-link";

/**
 * La página del **enlace de la entidad** (R-42): el botón «Ver la PQRSD
 * completa» del correo a la entidad lleva aquí. Es pública y sin sesión,
 * porque casi ninguna entidad tiene cuenta; la credencial es el token de la
 * dirección, que solo viaja en ese correo.
 *
 * Enseña lo mismo que el correo, con sus etiquetas, y deja confirmar la
 * recepción y anotar el radicado de la entidad.
 *
 * 🔴 **Que el token no salga de aquí.** El middleware le pone las cabeceras de
 * `ENTITY_LINK_HEADERS` (sin `Referer`, sin índice, sin caché), el layout raíz
 * no carga Google Tag Manager en `/entidad/*`, y nada de este fichero escribe
 * la dirección en el registro. Por lo mismo no hay ningún `<Link>` hacia el
 * resto del sitio: una navegación de cliente montaría GTM, que vería pasar
 * esta dirección al volver atrás.
 */

// Cada lectura cuenta como una apertura en el backend: nunca se sirve de caché.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "PQRSD enviada a través de Quéjate",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

/** Respuesta de `GET /entity-links/:token` (`EntityLinkViewDto`). */
interface EntityLinkView {
  pqr: {
    consecutiveCode: string | null;
    type: keyof typeof typeMap;
    status: keyof typeof statusMap;
    createdAt: string;
    dueDate: string;
    entity: { name: string };
    department: { name: string } | null;
    subject: string | null;
    description: string | null;
    location: { latitude: number; longitude: number } | null;
    anonymous: boolean;
    contact: { name: string; email: string; phone: string };
    customFields: { name: string; value: string }[];
    attachments: { name: string; url: string; type: string }[];
  };
  confirmation: EntityLinkConfirmationState | null;
}

type LoadResult =
  | { status: "ok"; view: EntityLinkView }
  | { status: "not-found" | "rate-limited" | "failed" };

/**
 * Lee el enlace en el backend.
 *
 * Sin la sesión del visitante: el enlace no depende de quién lo abra, solo del
 * token. La IP sí viaja, firmada (`backendFetch`, R-36), porque el backend
 * cuenta 30 peticiones por IP y minuto y sin ella todas las entidades
 * compartirían el mismo cupo.
 *
 * Nunca lanza: un error que subiera a Next acabaría en el registro, y no hay
 * nada que ganar enseñando más que «no se pudo cargar».
 */
async function loadEntityLink(token: string): Promise<LoadResult> {
  if (!isBase64UrlToken(token)) {
    return { status: "not-found" };
  }

  let response: Response;
  try {
    response = await backendFetch(
      `/entity-links/${encodeURIComponent(token)}`,
      { cookie: "", authorization: "" },
    );
  } catch {
    console.error("[entidad] el backend no respondió a la lectura del enlace");
    return { status: "failed" };
  }

  if (response.status === 404) return { status: "not-found" };
  if (response.status === 429) return { status: "rate-limited" };
  if (!response.ok) {
    console.error(`[entidad] la lectura del enlace respondió ${response.status}`);
    return { status: "failed" };
  }

  try {
    return { status: "ok", view: (await response.json()) as EntityLinkView };
  } catch {
    console.error("[entidad] la lectura del enlace no trajo JSON");
    return { status: "failed" };
  }
}

/**
 * Solo se enlaza lo que es `http(s)`: la dirección de un adjunto la manda el
 * cliente al radicar. Lo demás se enseña por su nombre, sin enlace.
 */
function isWebUrl(url: string): boolean {
  return /^https?:\/\//i.test(url);
}

/** Atributos de todo enlace que sale de la página. */
const EXTERNAL_LINK = {
  target: "_blank",
  rel: "noopener noreferrer",
} as const;

function Card({ children }: { children: ReactNode }) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
      {children}
    </section>
  );
}

function CardTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="mb-3 text-base font-semibold text-gray-900">{children}</h2>
  );
}

/** Lista de etiqueta y valor: apiladas en el teléfono, en dos columnas desde `sm`. */
function Fields({ children }: { children: ReactNode }) {
  return <dl className="space-y-3">{children}</dl>;
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="sm:grid sm:grid-cols-[13rem_1fr] sm:gap-4">
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="text-gray-900 whitespace-pre-line [overflow-wrap:anywhere]">
        {children}
      </dd>
    </div>
  );
}

export default async function EntityLinkPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const result = await loadEntityLink(token);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-2xl space-y-4 px-4 py-8 sm:py-10">
        <Logo className="!h-8 sm:!h-9" />

        {result.status === "ok" ? (
          <EntityLinkContent token={token} view={result.view} />
        ) : (
          <Card>
            <h1 className="text-base font-medium text-gray-900">
              {result.status === "not-found"
                ? ENTITY_LINK_MESSAGES.notFound
                : result.status === "rate-limited"
                  ? ENTITY_LINK_MESSAGES.rateLimited
                  : ENTITY_LINK_MESSAGES.loadFailed}
            </h1>
          </Card>
        )}

        <p className="pt-2 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Quéjate
        </p>
      </div>
    </main>
  );
}

function EntityLinkContent({
  token,
  view,
}: {
  token: string;
  view: EntityLinkView;
}) {
  const { pqr, confirmation } = view;
  const coordinates = pqr.location
    ? `${pqr.location.latitude}, ${pqr.location.longitude}`
    : null;

  return (
    <>
      <Card>
        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
          PQRSD enviada a través de Quéjate
        </h1>
        <p className="mt-2 text-gray-700">
          Esta PQRSD le llegó a su entidad a través de Quéjate. Para responder,
          conteste el correo en el que recibió este enlace.
        </p>
      </Card>

      <Card>
        {pqr.consecutiveCode && (
          <div className="mb-4 rounded-lg bg-primary/5 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Número de seguimiento en Quéjate
            </p>
            <p className="mt-1 text-lg font-bold text-gray-900 [overflow-wrap:anywhere]">
              {pqr.consecutiveCode}
            </p>
          </div>
        )}
        <Fields>
          <Field label="Tipo">{typeMap[pqr.type].label}</Field>
          <Field label="Estado">{statusMap[pqr.status].label}</Field>
          <Field label="Fecha de envío">{formatDate(pqr.createdAt)}</Field>
          <Field label="Fecha límite de respuesta">
            {formatDateWithoutTime(pqr.dueDate)}
          </Field>
          <Field label="Entidad">{pqr.entity.name}</Field>
          {pqr.department && (
            <Field label="Área">{pqr.department.name}</Field>
          )}
        </Fields>
      </Card>

      <Card>
        <CardTitle>Asunto</CardTitle>
        <p className="text-gray-900 whitespace-pre-line [overflow-wrap:anywhere]">
          {pqr.subject ?? "No proporcionado"}
        </p>
        <div className="mt-5">
          <CardTitle>Descripción</CardTitle>
          <p className="text-gray-700 whitespace-pre-line [overflow-wrap:anywhere]">
            {pqr.description ?? "No proporcionada"}
          </p>
        </div>
      </Card>

      {coordinates && (
        <Card>
          <CardTitle>Referencia geográfica del solicitante</CardTitle>
          <Fields>
            <Field label="Coordenadas">{coordinates}</Field>
          </Fields>
          <a
            href={`https://www.google.com/maps?q=${encodeURIComponent(coordinates)}`}
            {...EXTERNAL_LINK}
            className="mt-3 inline-block font-medium text-primary underline underline-offset-2"
          >
            Ver en el mapa
          </a>
        </Card>
      )}

      <Card>
        <CardTitle>Información del ciudadano</CardTitle>
        <Fields>
          <Field label="Nombre">{pqr.contact.name}</Field>
          <Field label="Correo">{pqr.contact.email}</Field>
          <Field label="Teléfono">{pqr.contact.phone}</Field>
        </Fields>
      </Card>

      {pqr.customFields.length > 0 && (
        <Card>
          <CardTitle>Información adicional</CardTitle>
          <Fields>
            {pqr.customFields.map((field, index) => (
              <Field key={index} label={field.name}>
                {field.value}
              </Field>
            ))}
          </Fields>
        </Card>
      )}

      {pqr.attachments.length > 0 && (
        <Card>
          <CardTitle>Archivos adjuntos</CardTitle>
          <ul className="space-y-2">
            {pqr.attachments.map((attachment, index) => (
              <li key={index} className="[overflow-wrap:anywhere]">
                {isWebUrl(attachment.url) ? (
                  <a
                    href={attachment.url}
                    {...EXTERNAL_LINK}
                    className="font-medium text-primary underline underline-offset-2"
                  >
                    {attachment.name}
                  </a>
                ) : (
                  <span className="font-medium">{attachment.name}</span>
                )}{" "}
                <span className="text-sm text-gray-500">({attachment.type})</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <EntityLinkConfirmation
        token={token}
        initialConfirmation={confirmation}
      />
    </>
  );
}
