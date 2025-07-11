import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PQR } from "@/types/pqrsd";
import { toast } from "@/hooks/use-toast";
import { createPdfWithMembrete, getImageBase64 } from "@/utils/pdfMembrete";
import {
  Download,
  Loader2,
  Mail
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

  const handleDownloadPDF = async () => {
    if (!generatedDocument) return;

    setIsDownloading(true);
    try {
      const doc = await createPdfWithMembrete("/MembreteWeb.png", "portrait", "a4");      
      const membreteImgBase64 = await getImageBase64("/MembreteWeb.png");

      const margin = 30;
      const pageWidth = doc.internal.pageSize.getWidth();
      const maxWidth = pageWidth - margin * 2;
      const lineHeight = 7;
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
          yPosition += lineHeight;
          continue;
        }

        if (line.match(/^(HECHOS:|MOTIVOS:|SOLICITUD:|CONCLUSIONES:)/i)) {
          doc.setFontSize(12);
          doc.setFont("helvetica", "bold");
          const textLines = doc.splitTextToSize(line, maxWidth);
          doc.text(textLines, margin, yPosition);
          yPosition += textLines.length * lineHeight + 2;
          doc.setFontSize(11);
          doc.setFont("helvetica", "normal");
          continue;
        }

        const textLines = doc.splitTextToSize(line, maxWidth);
        doc.text(textLines, margin, yPosition);
        yPosition += textLines.length * lineHeight;

        if (yPosition > doc.internal.pageSize.getHeight() - 35) {
          doc.addPage();
          const width = doc.internal.pageSize.getWidth();
          const height = doc.internal.pageSize.getHeight();
          doc.addImage(membreteImgBase64, "PNG", 0, 0, width, height);
          yPosition = 60;
        }
      }

      doc.save(`reporte_ente_control_${pqrData?.entity?.name || "documento"}.pdf`);

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
                  Después de descargar, puedes enviar este documento a {oversightEntity.name} a través del correo: <span className="font-medium">{oversightEntity.email}</span>
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex justify-center">
          <Button
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="w-full max-w-md bg-red-400 text-white hover:bg-red-500 focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
          >
            {isDownloading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            Descargar PDF
          </Button>
        </div>
      </div>
    </div>
  );
}