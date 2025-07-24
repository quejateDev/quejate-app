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

  async generateTutelaDocument(documentData: any): Promise<string> {
    const apiUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL;
    if (!apiUrl) throw new Error("URL de API no configurada");

    const response = await fetch(apiUrl, {
      method: "POST",
      mode: "cors",
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer token'
      },
      body: JSON.stringify(documentData),
    });

    if (!response.ok) {
      throw new Error("Error al generar el documento");
    }

    const data = await response.json();
    return data.tutela;
  }

  async generateOversightDocument(documentData: any): Promise<string> {
    const response = await fetch("/api/legal-docs/oversight", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(documentData),
    });

    if (!response.ok) {
      throw new Error("Error al generar el documento");
    }

    const data = await response.json();
    return data.document;
  }
}

export const pqrFollowUpService = new PQRFollowUpService();
