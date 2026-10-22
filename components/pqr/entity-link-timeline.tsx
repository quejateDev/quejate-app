import { Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/dateUtils";

/**
 * El enlace de la entidad a la PQRSD, tal como lo trae `GET /pqr/:id` (R-42).
 * Solo le llega al autor, y `null` si la PQRSD no tiene enlace.
 */
export interface PqrEntityLinkStatus {
  /** La primera vez que la entidad abrió el enlace en un navegador. */
  openedAt: string | null;
  confirmedAt: string | null;
  /** El radicado que anotó la entidad al confirmar, si anotó uno. */
  radicado: string | null;
}

/** Un paso de la cronología. */
interface TimelineStep {
  key: string;
  done: boolean;
  /** Lo que pasó o, si todavía no, que no ha pasado. */
  text: string;
  /** Cuándo pasó, si se sabe. */
  at: string | null;
  detail?: { label: string; value: string };
}

function timelineSteps(
  entityName: string,
  createdAt: string,
  link: PqrEntityLinkStatus,
): TimelineStep[] {
  // Solo se confirma desde la página del enlace, así que una confirmación
  // también es una apertura, aunque no conste su fecha: el aviso del navegador
  // pudo fallar, o la entidad confirmar antes de que existiera.
  const opened = link.openedAt !== null || link.confirmedAt !== null;

  return [
    {
      key: "sent",
      done: true,
      text: `Enviada a ${entityName}`,
      at: createdAt,
    },
    // Aquí irá «Entregada al buzón de la entidad».
    opened
      ? {
          key: "opened",
          done: true,
          text: "La entidad abrió el enlace del correo",
          at: link.openedAt,
        }
      : {
          key: "opened",
          done: false,
          text: "La entidad todavía no ha abierto el enlace.",
          at: null,
        },
    link.confirmedAt !== null
      ? {
          key: "confirmed",
          done: true,
          text: "La entidad confirmó que la recibió",
          at: link.confirmedAt,
          detail: link.radicado
            ? { label: "Radicado de la entidad", value: link.radicado }
            : undefined,
        }
      : {
          key: "confirmed",
          done: false,
          text: "La entidad todavía no ha confirmado que la recibió.",
          at: null,
        },
  ];
}

/**
 * «Seguimiento del envío»: cuándo se envió la PQRSD a la entidad, cuándo la
 * entidad abrió el enlace del correo y cuándo confirmó que la recibió, como
 * en un correo certificado (R-42). Fechas en hora de Colombia.
 *
 * Los pasos salen de {@link timelineSteps}; uno nuevo es un elemento más de
 * esa lista.
 */
export function EntityLinkTimeline({
  entityName,
  createdAt,
  link,
}: {
  entityName: string;
  createdAt: string;
  link: PqrEntityLinkStatus;
}) {
  const steps = timelineSteps(entityName, createdAt, link);

  return (
    <Card>
      <CardHeader className="bg-muted py-3 mb-6 rounded-t-md">
        <CardTitle className="text-xl font-bold">Seguimiento del envío</CardTitle>
      </CardHeader>
      <CardContent>
        <ol>
          {steps.map((step, index) => (
            <li key={step.key} className="relative flex gap-3 pb-6 last:pb-0">
              {index < steps.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute left-3 top-7 bottom-1 w-px -translate-x-1/2 bg-gray-300"
                />
              )}
              {step.done ? (
                <span
                  aria-hidden="true"
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"
                >
                  <Check className="h-4 w-4" />
                </span>
              ) : (
                <span
                  aria-hidden="true"
                  className="h-6 w-6 shrink-0 rounded-full border-2 border-gray-300 bg-white"
                />
              )}
              <div className="min-w-0 pt-0.5">
                <p className={step.done ? "font-medium text-gray-900" : "text-gray-500"}>
                  {step.text}
                </p>
                {step.at && (
                  <p className="text-sm text-gray-600">
                    <time dateTime={step.at}>{formatDate(step.at)}</time>
                  </p>
                )}
                {step.detail && (
                  <p className="mt-1 text-sm text-gray-700">
                    {step.detail.label}:{" "}
                    {/* En bloque: un radicado como «EXT-2026-004512» pasa entero
                        a la línea siguiente en vez de partirse por un guion. */}
                    <span className="inline-block max-w-full [overflow-wrap:anywhere]">
                      {step.detail.value}
                    </span>
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-6 text-xs text-gray-500">
          Quéjate no puede garantizar que la entidad abra el correo ni que responda.
        </p>
      </CardContent>
    </Card>
  );
}
