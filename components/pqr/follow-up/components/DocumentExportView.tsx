import { DocumentExport } from "./DocumentExport";
import { OversightDocumentExport } from "./OversightDocumentExport";
import { PQR } from "@/types/pqrsd";
import { OversightEntity } from "../types";

type DocumentExportViewProps = {
  selectedOption: string | null;
  generatedDocument: string;
  pqrData: PQR;
  oversightEntity: OversightEntity | null;
  onClose: () => void;
};

export function DocumentExportView({
  selectedOption,
  generatedDocument,
  pqrData,
  oversightEntity,
  onClose,
}: DocumentExportViewProps) {
  if (selectedOption === "oversight") {
    return (
      <OversightDocumentExport
        generatedDocument={generatedDocument}
        onClose={onClose}
        pqrData={pqrData}
        oversightEntity={oversightEntity}
      />
    );
  }

  return (
    <DocumentExport
      generatedDocument={generatedDocument}
      onClose={onClose}
      pqrData={pqrData}
    />
  );
}
