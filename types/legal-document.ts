/**
 * Un documento legal guardado del titular, tal como llega de
 * `GET /api/legal-docs` (Tareas 26 y 27 del backend). **Sin el texto**: el
 * historial no mueve documentos enteros.
 */
export type LegalDocumentSummary = {
  id: string;
  /** `TUTELA`, o `OVERSIGHT` para el oficio a un ente de control. */
  type: "TUTELA" | "OVERSIGHT";
  /**
   * Rótulo que pone el backend. Es lo que se pinta, y no un texto derivado de
   * `type`: así un tipo nuevo no deja filas en blanco.
   */
  title: string;
  /** PQRSD de la que nació, si el cliente la envió al generarlo. */
  pqrId: string | null;
  createdAt: string;
  /** Cuándo se borra: `createdAt` + 6 meses. Desde ese instante responde 404. */
  expiresAt: string;
};

/** `GET /api/legal-docs/:id`: la fila del historial más el texto. */
export type LegalDocumentDetail = LegalDocumentSummary & {
  content: string;
};
