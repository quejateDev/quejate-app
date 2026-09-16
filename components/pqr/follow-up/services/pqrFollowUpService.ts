import { OversightEntity } from "../types";

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

  private async generateDocument(documentType: string, documentData: any): Promise<string> {
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
    return data.document;
  }

  async generateTutelaDocument(documentData: any): Promise<string> {
    return this.generateDocument("tutela", documentData);
  }

  async generateOversightDocument(documentData: any): Promise<string> {
    return this.generateDocument("oversight", documentData);
  }
}

export const pqrFollowUpService = new PQRFollowUpService();
