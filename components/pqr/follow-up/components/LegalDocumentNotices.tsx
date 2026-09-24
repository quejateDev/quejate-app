import { AlertTriangle, Clock, FileX } from "lucide-react";
import {
  LEGAL_DOC_DRAFT_NOTICE,
  LEGAL_DOC_NOT_SAVED_NOTICE,
  LEGAL_DOC_RETENTION_NOTICE,
} from "../constants/legalDocsCopy";

/**
 * Lo que el ciudadano tiene que saber de un documento legal **antes** de
 * descargarlo: que es un borrador del que la plataforma no responde, y cuánto
 * tiempo se guarda.
 *
 * El plazo solo se promete si el backend guardó el documento de verdad
 * (`saved`). Si el guardado falló, decir «lo guardamos seis meses» sería
 * falso, y en su lugar se explica que esta vez no hay PDF.
 */
export function LegalDocumentNotices({ saved }: { saved: boolean }) {
  return (
    <div className="space-y-2 text-sm">
      <div className="flex items-start gap-2 p-3 rounded-lg border border-amber-200 bg-amber-50 text-amber-800">
        <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
        <p>{LEGAL_DOC_DRAFT_NOTICE}</p>
      </div>

      {saved ? (
        <div className="flex items-start gap-2 p-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-700">
          <Clock className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <p>{LEGAL_DOC_RETENTION_NOTICE}</p>
        </div>
      ) : (
        <div className="flex items-start gap-2 p-3 rounded-lg border border-red-200 bg-red-50 text-red-700">
          <FileX className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <p>{LEGAL_DOC_NOT_SAVED_NOTICE}</p>
        </div>
      )}
    </div>
  );
}
