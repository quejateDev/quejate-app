import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PQR } from "@/types/pqrsd";
import { toast } from "@/hooks/use-toast";
import { createPdfWithMembrete, getImageBase64 } from "@/utils/pdfMembrete";
import { useS3Upload } from "@/hooks/use-s3-upload";
import {
  Download,
  Loader2,
  Mail,
  Send
} from "lucide-react";
import { OversightEntity } from "../types";

interface OversightDocumentExportProps {
  generatedDocument: string;
  onClose: () => void;
  pqrData: PQR;
  oversightEntity: OversightEntity | null;
}

export function OversightDocumentExport({
  generatedDocument,
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
            name: `${pqrData.creator?.firstName || ""} ${pqrData.creator?.lastName || ""}`.trim() || "Usuario",
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

  const generatePDFBlob = async (): Promise<Blob> => {
    const doc = await createPdfWithMembrete("/MembreteWeb.png", "portrait", "a4");      
    const membreteImgBase64 = await getImageBase64("/MembreteWeb.png");

    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const maxWidth = pageWidth - margin * 2;
    const lineHeight = 6;
    let yPosition = 60;

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(`DOCUMENTO PARA ${oversightEntity?.name || "ENTE DE CONTROL"}`, pageWidth / 2, 40, { align: "center" });

    yPosition = 70;

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");

    const lines = generatedDocument.split("\n");

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.trim() === "") {
        yPosition += lineHeight * 0.5;
        continue;
      }

      if (line.match(/^(HECHOS:|MOTIVOS:|SOLICITUD:|CONCLUSIONES:)/i)) {
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        const textLines = doc.splitTextToSize(line, maxWidth);
        doc.text(textLines, margin, yPosition);
        yPosition += textLines.length * lineHeight + 1;
        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        continue;
      }

      const textLines = doc.splitTextToSize(line, maxWidth);

      doc.text(textLines, margin, yPosition, { align: "justify", maxWidth: maxWidth });
      yPosition += textLines.length * lineHeight;

      if (yPosition > doc.internal.pageSize.getHeight() - 35) {
        doc.addPage();
        const width = doc.internal.pageSize.getWidth();
        const height = doc.internal.pageSize.getHeight();
        doc.addImage(membreteImgBase64, "PNG", 0, 0, width, height);
        yPosition = 60;
      }
    }

    const pdfBlob = doc.output('blob');
    return pdfBlob;
  };

  const handleSendEmail = async () => {
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
      const pdfBlob = await generatePDFBlob();
      const file = new File([pdfBlob], `reporte_ente_control_${pqrData?.entity?.name || "documento"}.pdf`, {
        type: 'application/pdf'
      });

      await upload(file);
      
    } catch (error) {
      console.error("Error al procesar el documento:", error);
      toast({
        title: "Error",
        description: "Error al procesar el documento para envío",
        variant: "destructive",
      });
      setIsSendingEmail(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!generatedDocument) return;

    setIsDownloading(true);
    try {
      const pdfBlob = await generatePDFBlob();
      
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `reporte_ente_control_${pqrData?.entity?.name || "documento"}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Documento descargado",
        description: "El archivo PDF para el ente de control se ha generado correctamente",
      });
    } catch (error) {
      console.error("Error al generar PDF:", error);
      toast({
        title: "Error",
        description: "No se pudo generar el documento PDF",
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
            disabled={isDownloading || isSendingEmail || isUploading}
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
              disabled={isDownloading || isSendingEmail || isUploading}
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