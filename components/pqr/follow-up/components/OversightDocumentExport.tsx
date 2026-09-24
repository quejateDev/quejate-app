import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PQR } from "@/types/pqrsd";
import { toast } from "@/hooks/use-toast";
import { useS3Upload } from "@/hooks/use-s3-upload";
import {
  Download,
  Loader2,
  Mail,
  Send
} from "lucide-react";
import { OversightEntity } from "../types";
import {
  PdfDownloadError,
  pqrFollowUpService,
} from "../services/pqrFollowUpService";
import { describePdfError, saveFile } from "../utils/pdfDownload";
import {
  LEGAL_DOC_NOT_SAVED_NOTICE,
  LEGAL_DOC_UNAVAILABLE,
} from "../constants/legalDocsCopy";

interface OversightDocumentExportProps {
  generatedDocument: string;
  /**
   * Id del oficio guardado en el backend. Sin él no hay PDF, y por tanto
   * tampoco nada que adjuntar al correo del ente de control.
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

  const { upload, isUploading } = useS3Upload({
    folder: 'oversight-documents',
    onSuccess: (url) => {
      sendEmailWithDocument(url);
    },
    onError: (error) => {
      console.error('Error uploading document:', error);
      toast({
        title: "Error",
        description: "Error al subir el documento a S3",
        variant: "destructive",
      });
      setIsSendingEmail(false);
    }
  });

  const sendEmailWithDocument = async (documentUrl: string) => {
    try {
      const response = await fetch('/api/oversight/send-document', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          oversightEntity,
          pqrData,
          documentUrl,
          creatorInfo: {
            name: `${pqrData.creator?.name || ""}`.trim() || "Usuario",
            email: "usuario@quejate.com.co", // Email por defecto ya que no está en la estructura actual
            phone: ""
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Error al enviar el correo');
      }

      const result = await response.json();
      
      toast({
        title: "Correos enviados exitosamente",
        description: `El documento ha sido enviado a ${oversightEntity?.name} y se ha enviado una confirmación a tu correo`,
      });

      onClose();
      
    } catch (error) {
      console.error('Error sending email:', error);
      toast({
        title: "Error",
        description: "Error al enviar el correo con el documento",
        variant: "destructive",
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleSendEmail = async () => {
    if (!documentId) return;

    if (!oversightEntity?.email) {
      toast({
        title: "Error",
        description: "No se encontró el correo del ente de control",
        variant: "destructive",
      });
      return;
    }

    setIsSendingEmail(true);
    try {
      // El PDF lo maqueta el backend y llega con el nombre que él le pone
      // (`oficio_ente_control.pdf`). Se sube y se envía igual que antes.
      const file = await pqrFollowUpService.getLegalDocumentPdf(documentId);

      await upload(file);
      
    } catch (error) {
      console.error("Error al procesar el documento:", error);
      toast({
        ...(error instanceof PdfDownloadError
          ? describePdfError(error, LEGAL_DOC_UNAVAILABLE)
          : {
              title: "Error",
              description: "Error al procesar el documento para envío",
            }),
        variant: "destructive",
      });
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
        {!documentId && (
          <p className="mb-4 text-sm text-red-700">
            {LEGAL_DOC_NOT_SAVED_NOTICE}
          </p>
        )}

        {oversightEntity?.email && (
          <div className="mb-4 p-4 rounded-lg bg-blue-50 border border-blue-200 text-blue-700">
            <div className="flex items-start">
              <Mail className="h-5 w-5 mr-2 mt-0.5" />
              <div>
                <p className="text-sm">
                  Se enviará el documento a <span className="font-medium">{oversightEntity.name}</span> a través del correo: <span className="font-medium">{oversightEntity.email}</span>
                </p>
                <p className="text-sm mt-1">
                  También recibirás una confirmación en tu correo electrónico.
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={handleDownloadPDF}
            disabled={isDownloading || isSendingEmail || isUploading || !documentId}
            className="flex-1 max-w-sm bg-red-400 text-white hover:bg-red-500 focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
          >
            {isDownloading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            Descargar PDF
          </Button>
          
          {oversightEntity?.email && (
            <Button
              onClick={handleSendEmail}
              disabled={isDownloading || isSendingEmail || isUploading || !documentId}
              className="flex-1 max-w-sm bg-blue-500 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
            >
              {isSendingEmail || isUploading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              {isSendingEmail || isUploading ? 'Enviando...' : 'Enviar por Correo'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}