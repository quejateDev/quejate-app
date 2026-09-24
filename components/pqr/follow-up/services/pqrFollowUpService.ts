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
   * el que se descarga y con el que se sube cuando el oficio va por correo.
   *
   * @throws {PdfDownloadError} si el backend no lo entrega.
   */
  async getLegalDocumentPdf(documentId: string): Promise<File> {
    return this.fetchPdf(`/api/legal-docs/${encodeURIComponent(documentId)}/pdf`);
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
