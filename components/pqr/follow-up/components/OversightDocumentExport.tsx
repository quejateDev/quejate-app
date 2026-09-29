import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { PQR } from "@/types/pqrsd";
import { toast } from "@/hooks/use-toast";
import {
  AlertTriangle,
  CheckCircle2,
  Download,
  Loader2,
  Mail,
  MailX,
  Send,
  XCircle,
} from "lucide-react";
import { OversightEntity } from "../types";
import {
  OversightSendResult,
  pqrFollowUpService,
} from "../services/pqrFollowUpService";
import { describePdfError, saveFile } from "../utils/pdfDownload";
import {
  OversightSendNotice,
  allowsAnotherSend,
  describeOversightSend,
} from "../utils/oversightSend";
import {
  LEGAL_DOC_UNAVAILABLE,
  OVERSIGHT_SEND_NOT_SAVED_NOTICE,
} from "../constants/legalDocsCopy";
import { LegalDocumentNotices } from "./LegalDocumentNotices";

interface OversightDocumentExportProps {
  generatedDocument: string;
  /**
   * Id del oficio guardado en el backend. Sin él no hay PDF ni envío: el
   * backend maqueta los dos a partir del documento guardado.
   */
  documentId: string | null;
  onClose: () => void;
  pqrData: PQR;
  oversightEntity: OversightEntity | null;
}

export function OversightDocumentExport({
  generatedDocument,
  documentId,
  onClose,
  pqrData,
  oversightEntity,
}: OversightDocumentExportProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [sendResult, setSendResult] = useState<OversightSendResult | null>(null);
  // El estado de React no se ve hasta el siguiente pintado; esto sí, y es lo
  // que impide que un doble clic mande el oficio dos veces.
  const sendingRef = useRef(false);

  // El directorio puede tener un ente sin buzón: el backend respondería 409.
  const hasMailbox = !!oversightEntity?.email?.trim();
  const canSend = !!documentId && !!oversightEntity && hasMailbox;
  const sendOpen = canSend && allowsAnotherSend(sendResult);

  const sendNotice = ((): OversightSendNotice | null => {
    if (!oversightEntity) return null;
    if (sendResult) return describeOversightSend(sendResult, oversightEntity);
    // Sin buzón se avisa desde el principio, con el mismo texto que el 409,
    // en vez de esconder el botón sin decir por qué.
    if (documentId && !hasMailbox) {
      return describeOversightSend({ kind: "no-mailbox" }, oversightEntity);
    }
    return null;
  })();

  const handleSendEmail = async () => {
    if (!documentId || !oversightEntity || sendingRef.current) return;

    sendingRef.current = true;
    setIsSendingEmail(true);
    // El aviso del intento anterior no describe el que empieza.
    setSendResult(null);
    try {
      // Del navegador solo salen identificadores. El backend maqueta el
      // oficio desde el documento guardado y lo envía adjunto al buzón que
      // tiene en su directorio para ese ente: ya no se sube a ninguna parte.
      setSendResult(
        await pqrFollowUpService.sendOversightLetter(documentId, {
          pqrId: pqrData.id,
          oversightEntityId: oversightEntity.id,
        })
      );
    } catch (error) {
      // `sendOversightLetter` no lanza. Si algo lo hiciera, la petición pudo
      // haber salido igual, y un botón de nuevo disponible invitaría a
      // repetirla.
      console.error("Error al enviar el oficio:", error);
      setSendResult({ kind: "unconfirmed" });
    } finally {
      sendingRef.current = false;
      setIsSendingEmail(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!documentId) return;

    setIsDownloading(true);
    try {
      saveFile(await pqrFollowUpService.getLegalDocumentPdf(documentId));

      toast({
        title: "Documento descargado",
        description: "El archivo PDF para el ente de control se ha descargado correctamente",
      });
    } catch (error) {
      console.error("Error al descargar el PDF:", error);
      toast({
        ...describePdfError(error, LEGAL_DOC_UNAVAILABLE),
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            Documento para {oversightEntity?.name || "Ente de Control"}
          </h2>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="prose max-w-none whitespace-pre-wrap">
          {generatedDocument}
        </div>
      </div>

      <div className="p-6 border-t">
        <div className="mb-4 space-y-2">
          <LegalDocumentNotices saved={!!documentId} />

          {oversightEntity && !documentId && (
            <div className="flex items-start gap-2 p-3 rounded-lg border border-red-200 bg-red-50 text-sm text-red-700">
              <MailX className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <p>{OVERSIGHT_SEND_NOT_SAVED_NOTICE}</p>
            </div>
          )}
        </div>

        {sendOpen && (
          <div className="mb-4 p-4 rounded-lg bg-blue-50 border border-blue-200 text-blue-700">
            <div className="flex items-start">
              <Mail className="h-5 w-5 mr-2 mt-0.5" />
              <div>
                <p className="text-sm">
                  Se enviará el documento a <span className="font-medium">{oversightEntity?.name}</span> a través del correo: <span className="font-medium">{oversightEntity?.email}</span>
                </p>
                <p className="text-sm mt-1">
                  También recibirás una confirmación en tu correo electrónico.
                </p>
              </div>
            </div>
          </div>
        )}

        {sendNotice && (
          <SendNotice
            notice={sendNotice}
            // Tras un envío sin confirmar, el reenvío existe pero no está a un
            // clic distraído: el ciudadano tiene que decir que lo comprobó.
            onConfirmedResend={
              sendResult?.kind === "unconfirmed" ? handleSendEmail : undefined
            }
          />
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={handleDownloadPDF}
            disabled={isDownloading || isSendingEmail || !documentId}
            className="flex-1 max-w-sm bg-red-400 text-white hover:bg-red-500 focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
          >
            {isDownloading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            Descargar PDF
          </Button>

          {sendOpen && (
            <Button
              onClick={handleSendEmail}
              disabled={isDownloading || isSendingEmail}
              className="flex-1 max-w-sm bg-blue-500 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
            >
              {isSendingEmail ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              {isSendingEmail ? 'Enviando...' : 'Enviar por Correo'}
            </Button>
          )}

          {sendResult?.kind === "sent" && (
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 max-w-sm"
            >
              Cerrar
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

const NOTICE_STYLES = {
  success: {
    box: "border-green-200 bg-green-50 text-green-800",
    Icon: CheckCircle2,
  },
  warning: {
    box: "border-amber-200 bg-amber-50 text-amber-800",
    Icon: AlertTriangle,
  },
  error: {
    box: "border-red-200 bg-red-50 text-red-700",
    Icon: XCircle,
  },
} as const;

/**
 * El resultado del envío, **fijo en la pantalla** y no en un aviso que se
 * desvanece: lo que dice —sobre todo «no lo vuelvas a enviar»— tiene que
 * seguir ahí cuando el ciudadano decida qué hacer.
 */
function SendNotice({
  notice,
  onConfirmedResend,
}: {
  notice: OversightSendNotice;
  onConfirmedResend?: () => void;
}) {
  const { box, Icon } = NOTICE_STYLES[notice.tone];

  return (
    <div
      role={notice.tone === "success" ? "status" : "alert"}
      className={`mb-4 flex items-start gap-2 p-4 rounded-lg border text-sm ${box}`}
    >
      <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
      <div className="space-y-1">
        <p className="font-medium">{notice.title}</p>
        <p>{notice.description}</p>
        {onConfirmedResend && (
          <button
            type="button"
            onClick={onConfirmedResend}
            className="pt-1 font-medium underline underline-offset-2 hover:no-underline"
          >
            Ya comprobé que no le llegó: enviarlo de nuevo
          </button>
        )}
      </div>
    </div>
  );
}
