import { DocumentExport } from "./DocumentExport";
import { OversightDocumentExport } from "./OversightDocumentExport";
import { PQR } from "@/types/pqrsd";
import { OversightEntity } from "../types";

type DocumentExportViewProps = {
  selectedOption: string | null;
  generatedDocument: string;
  /** Id del documento guardado en el backend; `null` si no se pudo guardar. */
  documentId: string | null;
  pqrData: PQR;
  oversightEntity: OversightEntity | null;
  onClose: () => void;
};

export function DocumentExportView({
  selectedOption,
  generatedDocument,
  documentId,
  pqrData,
  oversightEntity,
  onClose,
}: DocumentExportViewProps) {
  if (selectedOption === "oversight") {
    return (
      <OversightDocumentExport
        generatedDocument={generatedDocument}
        documentId={documentId}
        onClose={onClose}
        pqrData={pqrData}
        oversightEntity={oversightEntity}
      />
    );
  }

  return (
    <DocumentExport
      generatedDocument={generatedDocument}
      documentId={documentId}
      onClose={onClose}
      pqrData={pqrData}
    />
  );
}
