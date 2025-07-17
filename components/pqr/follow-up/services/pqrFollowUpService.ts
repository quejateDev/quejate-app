import { OversightEntity } from "../types";

export class PQRFollowUpService {
  async getOversightEntity(entityId: string): Promise<OversightEntity> {
    const entityResponse = await fetch(`/api/entities/${entityId}`);
    if (!entityResponse.ok) throw new Error("Error al obtener entidad");

    const entityData = await entityResponse.json();
    const categoryId = entityData.category?.id;
    if (!categoryId) {
      throw new Error("La entidad no tiene categoría asignada");
    }

    const oversightResponse = await fetch(
      `/api/category/${categoryId}/oversight-entity`
    );
    if (!oversightResponse.ok)
      throw new Error("Error al obtener ente de control");

    const { oversightEntity } = await oversightResponse.json();
    return oversightEntity;
  }

  async generateTutelaDocument(documentData: any): Promise<string> {
    const response = await fetch("/api/legal-docs/tutela", {
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
