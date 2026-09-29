import { OversightEntity } from "../types";
import {
  LegalDocumentDetail,
  LegalDocumentSummary,
} from "@/types/legal-document";

/**
 * Un documento legal recién generado.
 *
 * `id` es el del documento que el backend guarda al generarlo (Tareas 26 y 27),
 * y es lo único que permite pedir después su PDF. **Puede faltar**: el guardado
 * es *best effort* y, si falla, el backend devuelve el texto igual. Sin `id` no
 * hay PDF ni entrada en el historial.
 */
export type GeneratedLegalDocument = {
  document: string;
  id: string | null;
};

/**
 * Un PDF que el backend no entregó, con su estado para que la interfaz elija
 * el mensaje. El 404 cubre a la vez lo caducado, lo ajeno y lo inexistente: el
 * backend no los distingue, a propósito.
 */
export class PdfDownloadError extends Error {
  constructor(readonly status: number) {
    super(`El backend respondió ${status} al pedir el PDF`);
    this.name = "PdfDownloadError";
  }
}

/**
 * Cómo terminó el envío del oficio al ente de control, ya clasificado para la
 * interfaz.
 *
 * 🔴 No basta con «salió o no salió». Hay un tercer caso, `unconfirmed`, en el
 * que **no se sabe**: el oficio puede estar ya en el buzón del ente, y
 * reenviarlo lo duplicaría. Cada caso lleva su propio aviso
 * (`utils/oversightSend.ts`).
 */
export type OversightSendResult =
  /**
   * El oficio salió. `citizenNotified: false` quiere decir que la confirmación
   * al ciudadano no, **no** que el oficio fallara.
   */
  | { kind: "sent"; citizenNotified: boolean }
  /** Puede haber salido: el correo no respondió a tiempo, o se cortó algo. */
  | { kind: "unconfirmed" }
  /** 429. `retryAfterSeconds` es `null` si no llegó cuánto falta. */
  | { kind: "rate-limited"; retryAfterSeconds: number | null }
  /** 409: el ente no tiene buzón en el directorio. */
  | { kind: "no-mailbox" }
  /** 404: el oficio o la PQRSD ya no están, o el ente no corresponde. */
  | { kind: "not-found" }
  /** 401: la sesión caducó. */
  | { kind: "session-expired" }
  /** No salió, y se puede volver a intentar. */
  | { kind: "not-sent" };

/**
 * Códigos con los que el backend dice, en un 5xx, que el oficio **no** salió
 * (`OVERSIGHT_SEND_ERRORS` en `oversight-dispatch.service.ts`): Resend lo
 * rechazó o no se le pudo llamar (502), o falta su clave (503).
 *
 * Se mira el código y no solo el estado porque un 502 también lo dan Vercel,
 * Cloudflare o Render cuando se corta la conexión con el servidor de detrás,
 * y ese corte puede llegar con el oficio ya enviado.
 */
const NOT_SENT_CODES = new Set([
  "OVERSIGHT_MAIL_FAILED",
  "OVERSIGHT_MAIL_NOT_CONFIGURED",
]);

/**
 * Traduce la respuesta de `POST /api/legal-docs/:id/send` a un
 * {@link OversightSendResult}.
 *
 * La regla de fondo: **solo se da por no enviado lo que seguro no salió.**
 * Un 4xx es seguro, porque el backend rechaza antes de llamar a Resend; un 5xx
 * solo si trae uno de {@link NOT_SENT_CODES}. Todo lo demás —el 504 del corte
 * con Resend, un 500, un 502 de un salto intermedio— es `unconfirmed`: de
 * todas las equivocaciones posibles, la peor es decirle al ciudadano que no
 * salió algo que sí salió, porque lo reenvía y el ente recibe dos.
 */
export async function classifyOversightSend(
  response: Response
): Promise<OversightSendResult> {
  const body = await response.json().catch(() => null);

  if (response.ok) {
    // Si el cuerpo no se pudiera leer, se toma como que la confirmación no
    // llegó: es el aviso que dice «no lo reenvíes».
    return { kind: "sent", citizenNotified: body?.citizenNotified === true };
  }

  switch (response.status) {
    case 401:
      return { kind: "session-expired" };
    case 404:
      return { kind: "not-found" };
    case 409:
      return { kind: "no-mailbox" };
    case 429:
      return {
        kind: "rate-limited",
        retryAfterSeconds: parseRetryAfter(response.headers.get("retry-after")),
      };
  }

  if (response.status < 500) {
    return { kind: "not-sent" };
  }

  return NOT_SENT_CODES.has(body?.code)
    ? { kind: "not-sent" }
    : { kind: "unconfirmed" };
}

/**
 * Segundos de la cabecera `Retry-After`, o `null`. El backend los manda
 * enteros; la otra forma que admite el estándar, una fecha, no la emite.
 */
function parseRetryAfter(value: string | null): number | null {
  const seconds = Number(value);
  return value && Number.isFinite(seconds) && seconds > 0
    ? Math.ceil(seconds)
    : null;
}

export class PQRFollowUpService {

  async getOversightEntitiesByLocation(
    regionalDepartmentId: string,
    municipalityId?: string
  ): Promise<OversightEntity[]> {
    const params = new URLSearchParams({
      regionalDepartmentId,
    });

    if (municipalityId) {
      params.append("municipalityId", municipalityId);
    }

    const response = await fetch(`/api/oversight-entity/by-location?${params}`);
    if (!response.ok) {
      throw new Error("Error al obtener entes de control");
    }

    return response.json();
  }

  private async generateDocument(documentType: string, documentData: any): Promise<GeneratedLegalDocument> {
    // H-25: antes esto llamaba a la Lambda de AWS directamente desde el
    // navegador (`NEXT_PUBLIC_API_GATEWAY_URL`, sin sesión ni límite). Ahora va
    // al mismo origen, que reenvía al backend con la cookie de sesión.
    const response = await fetch("/api/legal-docs/document", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        documentType,
        ...documentData
      }),
    });

    if (!response.ok) {
      throw new Error("Error al generar el documento");
    }

    const data = await response.json();
    return {
      document: data.document,
      id: typeof data.id === "string" ? data.id : null,
    };
  }

  async generateTutelaDocument(documentData: any): Promise<GeneratedLegalDocument> {
    return this.generateDocument("tutela", documentData);
  }

  async generateOversightDocument(documentData: any): Promise<GeneratedLegalDocument> {
    return this.generateDocument("oversight", documentData);
  }

  /**
   * El PDF de un documento legal guardado → `GET /api/legal-docs/:id/pdf`.
   *
   * Lo maqueta el backend con el formato de su tipo; antes lo hacía jsPDF en el
   * navegador. El `File` lleva el nombre que el backend puso en
   * `Content-Disposition` (`tutela.pdf`, `oficio_ente_control.pdf`), que es con
   * el que se descarga.
   *
   * @throws {PdfDownloadError} si el backend no lo entrega.
   */
  async getLegalDocumentPdf(documentId: string): Promise<File> {
    return this.fetchPdf(`/api/legal-docs/${encodeURIComponent(documentId)}/pdf`);
  }

  /**
   * Envía el oficio guardado al ente de control →
   * `POST /api/legal-docs/:id/send`.
   *
   * Del navegador solo salen identificadores: el backend maqueta el oficio
   * desde el documento guardado y saca el buzón de su directorio. Antes el
   * navegador subía el PDF al bucket público (`oversight-documents/`) y
   * mandaba su URL (H-20).
   *
   * No lanza: devuelve el resultado ya clasificado
   * (ver {@link classifyOversightSend}).
   */
  async sendOversightLetter(
    documentId: string,
    target: { pqrId: string; oversightEntityId: string }
  ): Promise<OversightSendResult> {
    let response: Response;
    try {
      response = await fetch(
        `/api/legal-docs/${encodeURIComponent(documentId)}/send`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(target),
        }
      );
    } catch {
      // La petición pudo llegar y el oficio salir antes de que se cortara la
      // conexión: un corte no dice nada del otro lado.
      return { kind: "unconfirmed" };
    }

    return classifyOversightSend(response);
  }

  /**
   * El certificado de radicación de una PQRSD →
   * `GET /api/pqr/:id/certificate.pdf`.
   *
   * Quién puede pedirlo lo decide el backend —solo el autor; a cualquier otro
   * le responde 404—, así que aquí no se comprueba nada antes de llamar.
   *
   * @throws {PdfDownloadError} si el backend no lo entrega.
   */
  async getCertificatePdf(pqrId: string): Promise<File> {
    return this.fetchPdf(`/api/pqr/${encodeURIComponent(pqrId)}/certificate.pdf`);
  }

  /**
   * El historial de documentos legales del titular → `GET /api/legal-docs`,
   * del más reciente al más antiguo y sin el texto. El backend borra antes
   * los ya vencidos, así que todo lo que llega se puede descargar.
   */
  async listLegalDocuments(): Promise<LegalDocumentSummary[]> {
    const response = await fetch("/api/legal-docs");
    if (!response.ok) {
      throw new Error(`El backend respondió ${response.status} al pedir el historial`);
    }

    return response.json();
  }

  /**
   * Un documento legal del titular con su texto → `GET /api/legal-docs/:id`.
   *
   * @returns `null` si ya no está disponible: el 404 cubre a la vez lo
   *   caducado, lo ajeno y lo inexistente, a propósito.
   */
  async getLegalDocument(documentId: string): Promise<LegalDocumentDetail | null> {
    const response = await fetch(`/api/legal-docs/${encodeURIComponent(documentId)}`);
    if (response.status === 404) {
      return null;
    }
    if (!response.ok) {
      throw new Error(`El backend respondió ${response.status} al pedir el documento`);
    }

    return response.json();
  }

  private async fetchPdf(url: string): Promise<File> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new PdfDownloadError(response.status);
    }

    const blob = await response.blob();
    return new File([blob], pdfFilename(response.headers.get("content-disposition")), {
      type: "application/pdf",
    });
  }
}

/**
 * Nombre del fichero que puso el backend en `Content-Disposition`
 * (`attachment; filename="tutela.pdf"`).
 *
 * El nombre es decisión del backend, fijo por tipo, y la web no lo cambia.
 * `documento.pdf` solo cubre que la cabecera no llegue.
 */
function pdfFilename(contentDisposition: string | null): string {
  return contentDisposition?.match(/filename="([^"]+)"/)?.[1] ?? "documento.pdf";
}

export const pqrFollowUpService = new PQRFollowUpService();
