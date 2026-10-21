"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatDate } from "@/lib/dateUtils";
import { ENTITY_LINK_MESSAGES } from "@/lib/entity-link";

/** Lo que la entidad confirmó, tal como lo devuelve el backend. */
export interface EntityLinkConfirmationState {
  confirmedAt: string;
  radicado: string | null;
}

/** Techo del radicado en el backend (`ENTITY_RADICADO_MAX_LENGTH`). */
const RADICADO_MAX_LENGTH = 100;

/**
 * El mensaje de un 400: el motivo concreto del radicado si lo trae
 * (`details.radicado`), y si no el `error` del backend.
 */
function badRequestMessage(body: unknown): string {
  if (typeof body !== "object" || body === null) {
    return ENTITY_LINK_MESSAGES.confirmFailed;
  }
  const { error, details } = body as {
    error?: unknown;
    details?: { radicado?: unknown };
  };
  const reasons = details?.radicado;
  if (Array.isArray(reasons) && typeof reasons[0] === "string") {
    return reasons[0];
  }
  return typeof error === "string" ? error : ENTITY_LINK_MESSAGES.confirmFailed;
}

/**
 * Cierra la frase con punto, salvo si ya acaba en uno: la hora de
 * `formatDate` termina en «a. m.» o «p. m.», y ese punto hace de final.
 */
function endSentence(text: string): string {
  return text.endsWith(".") ? text : `${text}.`;
}

/** El mensaje de cualquier otro fallo, sin más detalle. */
function failureMessage(status: number): string {
  if (status === 404) return ENTITY_LINK_MESSAGES.notFound;
  if (status === 429) return ENTITY_LINK_MESSAGES.rateLimited;
  return ENTITY_LINK_MESSAGES.confirmFailed;
}

/**
 * La entidad confirma que recibió la PQRSD y, si quiere, anota su radicado
 * (R-42). Va contra `app/api/entity-links/[token]/confirmation`.
 *
 * Confirmar otra vez no mueve la fecha: solo cambia el radicado si viene uno
 * escrito, y sin él el backend conserva el que había. Por eso, tras cada
 * respuesta, el campo se rellena con lo guardado.
 */
export function EntityLinkConfirmation({
  token,
  initialConfirmation,
}: {
  token: string;
  initialConfirmation: EntityLinkConfirmationState | null;
}) {
  const [confirmation, setConfirmation] = useState(initialConfirmation);
  const [radicado, setRadicado] = useState(
    initialConfirmation?.radicado ?? "",
  );
  const [pending, setPending] = useState(false);
  // `invalid` solo en un 400: el fallo es del radicado y no del enlace.
  const [error, setError] = useState<{
    message: string;
    invalid: boolean;
  } | null>(null);
  // El botón se deshabilita al re-renderizar; esto corta un doble clic que
  // llegue antes.
  const sending = useRef(false);
  // Sin hidratar, el botón enviaría el formulario a la manera del navegador:
  // un GET a esta misma página con el radicado en la dirección.
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending.current) return;
    sending.current = true;
    setPending(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/entity-links/${encodeURIComponent(token)}/confirmation`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ radicado }),
        },
      );

      if (response.ok) {
        const saved = (await response.json()) as EntityLinkConfirmationState;
        setConfirmation(saved);
        setRadicado(saved.radicado ?? "");
      } else if (response.status === 400) {
        const body: unknown = await response.json().catch(() => null);
        setError({ message: badRequestMessage(body), invalid: true });
      } else {
        setError({ message: failureMessage(response.status), invalid: false });
      }
    } catch {
      setError({
        message: ENTITY_LINK_MESSAGES.confirmFailed,
        invalid: false,
      });
    } finally {
      sending.current = false;
      setPending(false);
    }
  }

  return (
    <section
      aria-labelledby="entity-link-confirmation-title"
      className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6"
    >
      <div aria-live="polite">
        {confirmation ? (
          <>
            <h2
              id="entity-link-confirmation-title"
              className="flex items-start gap-2 text-base font-semibold text-green-700"
            >
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
              <span>
                Recepción confirmada el {endSentence(formatDate(confirmation.confirmedAt))}
              </span>
            </h2>
            {confirmation.radicado && (
              <p className="mt-2 text-gray-700 [overflow-wrap:anywhere]">
                Radicado: {confirmation.radicado}
              </p>
            )}
          </>
        ) : (
          <>
            <h2
              id="entity-link-confirmation-title"
              className="text-lg font-semibold text-gray-900"
            >
              ¿La recibieron?
            </h2>
            <p className="mt-1 text-gray-700">
              Confírmelo aquí. Si ya le asignaron un radicado, puede anotarlo y
              quedará registrado en la PQRSD.
            </p>
          </>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <div className="space-y-2">
          <Label htmlFor="entity-radicado">
            Radicado de su entidad (opcional)
          </Label>
          <Input
            id="entity-radicado"
            name="radicado"
            value={radicado}
            onChange={(event) => setRadicado(event.target.value)}
            maxLength={RADICADO_MAX_LENGTH}
            autoComplete="off"
            // El borde de siempre casi no se ve sobre la tarjeta blanca.
            className="border-gray-300 bg-white"
            aria-describedby={error ? "entity-radicado-error" : undefined}
            aria-invalid={error?.invalid || undefined}
          />
        </div>

        {error && (
          <p
            id="entity-radicado-error"
            role="alert"
            className="text-sm text-red-600"
          >
            {error.message}
          </p>
        )}

        <Button
          type="submit"
          disabled={!hydrated || pending}
          aria-busy={pending}
          className="w-full sm:w-auto"
        >
          {confirmation ? "Guardar el radicado" : "Confirmamos que la recibimos"}
        </Button>
      </form>
    </section>
  );
}
