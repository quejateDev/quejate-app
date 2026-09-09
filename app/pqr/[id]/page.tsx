import { cache } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { backendFetch, BackendError } from "@/lib/api/backend";
import { imageExtensions } from "@/constants/mediaExtensions";

const SITE_URL = "https://www.quejate.com.co";
const DEFAULT_OG_IMAGE =
  "https://quejate-files.s3.us-east-2.amazonaws.com/LogotipoEditableterpng.png";

type AttachmentLike = { url: string; type: string; name: string };

const isImageAttachment = (att: AttachmentLike) => {
  const t = att.type.toLowerCase();
  const ext = att.name.toLowerCase().split(".").pop() ?? "";
  return t.startsWith("image/") || imageExtensions.includes(t) || imageExtensions.includes(ext);
};

/** Lo que esta página lee de `GET /pqr/:id`; el detalle trae bastante más. */
interface PublicPqr {
  id: string;
  subject: string | null;
  description: string | null;
  private: boolean;
  entity: { name: string } | null;
  attachments: AttachmentLike[];
}

/**
 * La PQRSD para la tarjeta pública, o `null` si no debe verse.
 *
 * ## Por qué NO se reenvía la sesión
 *
 * Esta es la página del enlace que se comparte: lo que renderiza es lo que ve
 * un rastreador de redes sociales, que nunca lleva sesión. Pidiéndola siempre
 * sin identidad, la página **responde igual para todo el mundo** —que es lo
 * que ya hacía— y no llama a `cookies()`, así que Next puede seguir
 * sirviéndola sin recalcularla por visitante.
 *
 * Si se reenviara la sesión, el dueño de una PQRSD privada la vería aquí y el
 * resto no. No sería una fuga, pero sí una página que dice cosas distintas
 * según quién mire, y esta existe justamente para lo contrario.
 *
 * ## Por qué 403 y 404 se tratan igual
 *
 * El backend distingue: 404 si no existe, 403 si existe y es privada. Aquí las
 * dos son `null` → `notFound()`. Responder distinto convertiría esta página en
 * un oráculo: probando identificadores se sabría cuáles existen.
 *
 * El `pqr.private` de después es redundante hoy —sin sesión el backend ya
 * responde 403— y se queda como red: si algún día esto reenviara identidad,
 * la página seguiría sin publicar una privada.
 *
 * `cache()` de React lo memoriza dentro de la misma petición: `generateMetadata`
 * y el componente piden lo mismo, y sin esto serían dos viajes al backend.
 */
const getPublicPqr = cache(async (id: string): Promise<PublicPqr | null> => {
  const response = await backendFetch(`/pqr/${encodeURIComponent(id)}`, {
    cookie: "",
    authorization: "",
  });

  if (response.status === 404 || response.status === 403) return null;
  if (!response.ok) throw await BackendError.from(response, "/pqr/:id");

  const pqr = (await response.json()) as PublicPqr;
  return pqr.private ? null : pqr;
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const pqr = await getPublicPqr(id);

  if (!pqr) {
    return { title: "Quéjate", robots: { index: false, follow: false } };
  }

  const firstImage = pqr.attachments.find(isImageAttachment)?.url ?? DEFAULT_OG_IMAGE;
  const title = pqr.subject || "PQRSD en Quéjate";
  const description = (
    pqr.description || `Reporte dirigido a ${pqr.entity?.name ?? "una entidad"} en Quéjate`
  ).slice(0, 200);
  const url = `${SITE_URL}/pqr/${pqr.id}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: "Quéjate",
      type: "article",
      images: [{ url: firstImage }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [firstImage],
    },
  };
}

export default async function PublicPqrPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pqr = await getPublicPqr(id);

  if (!pqr) notFound();

  const firstImage = pqr.attachments.find(isImageAttachment)?.url ?? null;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {firstImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={firstImage}
              alt={pqr.subject ?? "Evidencia de la PQRSD"}
              className="w-full max-h-96 object-cover"
            />
          )}
          <div className="p-6 space-y-3">
            <h1 className="text-2xl font-bold text-gray-900">
              {pqr.subject || "PQRSD en Quéjate"}
            </h1>
            <p className="text-sm text-gray-500">
              Entidad: {pqr.entity?.name ?? "No especificada"}
            </p>
            <p className="text-gray-700 whitespace-pre-line">
              {pqr.description || "Sin descripción"}
            </p>
            <div className="pt-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
              >
                Ver en Quéjate
              </Link>
            </div>
          </div>
        </div>
        <p className="text-center text-xs text-gray-400 mt-6">
          © {new Date().getFullYear()} Quéjate
        </p>
      </div>
    </main>
  );
}
