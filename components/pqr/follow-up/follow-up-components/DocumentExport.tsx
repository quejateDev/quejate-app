import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

import { generatePQRSDCertificate } from "./generatePQRSDCertificate";
import { PQR } from "@/types/pqrsd";
import { toast } from "@/hooks/use-toast";
import jsPDF from "jspdf";

import {
  Copy,
  Download,
  Loader2,
  FileText,
  Check,
  FileX,
  FileCheck,
  Info,
} from "lucide-react";
import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Packer,
} from "docx";
import saveAs from "file-saver";

interface StepProps {
  onClose: () => void;
  pqrData: PQR;
}

export function DocumentExport({
  generatedDocument,
  onClose,
  pqrData,
  isGenerating = false,
}: StepProps & {
  generatedDocument: string | null;
  isGenerating?: boolean;
}) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [activeTab, setActiveTab] = useState("preview");
  const [copySuccess, setCopySuccess] = useState(false);

  const handleDownloadWord = async () => {
    if (!generatedDocument) return;

    setIsDownloading(true);
    try {
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "ACCIÓN DE TUTELA",
                    bold: true,
                    size: 24,
                  }),
                ],
                heading: HeadingLevel.HEADING_1,
                alignment: AlignmentType.CENTER,
                spacing: { after: 400 },
              }),
              ...generatedDocument
                .split("\n")
                .filter(Boolean)
                .map(
                  (line) =>
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: line,
                          size: 24,
                        }),
                      ],
                      spacing: { after: 200 },
                    })
                ),
            ],
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      saveAs(
        blob,
        `tutela_${pqrData?.department.entity.name || "documento"}.docx`
      );

      toast({
        title: "Documento descargado",
        description: "El archivo Word se ha generado correctamente",
      });
    } catch (error) {
      console.error("Error al generar Word:", error);
      toast({
        title: "Error",
        description: "No se pudo generar el documento Word",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!generatedDocument) return;

    setIsDownloading(true);
    try {
      const doc = new jsPDF();

      const margin = 20;
      const pageWidth = doc.internal.pageSize.getWidth();
      const maxWidth = pageWidth - margin * 2;
      const lineHeight = 7;
      let yPosition = 30;

      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("ACCIÓN DE TUTELA", pageWidth / 2, 20, { align: "center" });

      yPosition = 40;

      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");

      const lines = generatedDocument.split("\n");

      lines.forEach((line) => {
        if (line.trim() === "") {
          yPosition += lineHeight;
          return;
        }

        if (line.match(/^(HECHOS:|DERECHOS VULNERADOS:|PRETENSIONES:)/i)) {
          doc.setFontSize(12);
          doc.setFont("helvetica", "bold");
          const textLines = doc.splitTextToSize(line, maxWidth);
          doc.text(textLines, margin, yPosition);
          yPosition += textLines.length * lineHeight + 2;
          doc.setFontSize(11);
          doc.setFont("helvetica", "normal");
          return;
        }

        if (line.match(/^\d+\./)) {
          const parts = line.split(".");
          doc.setFont("helvetica", "bold");
          doc.text(parts[0] + ".", margin, yPosition);
          doc.setFont("helvetica", "normal");
          const remainingText = parts.slice(1).join(".").trim();
          if (remainingText) {
            const textLines = doc.splitTextToSize(remainingText, maxWidth - 10);
            doc.text(textLines, margin + 10, yPosition);
            yPosition += textLines.length * lineHeight;
          } else {
            yPosition += lineHeight;
          }
          return;
        }

        const textLines = doc.splitTextToSize(line, maxWidth);
        doc.text(textLines, margin, yPosition);
        yPosition += textLines.length * lineHeight;

        if (yPosition > doc.internal.pageSize.getHeight() - 20) {
          doc.addPage();
          yPosition = 20;
        }
      });

      doc.setFontSize(10);
      doc.setTextColor(100);

      doc.save(`tutela_${pqrData?.department.entity.name || "documento"}.pdf`);

      toast({
        title: "Documento descargado",
        description: "El archivo PDF se ha generado correctamente",
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

  const handleCopy = async () => {
    try {
      if (!generatedDocument) {
        toast({
          title: "Nada que copiar",
          description: "No hay contenido disponible para copiar",
          variant: "destructive",
        });
        return;
      }

      await navigator.clipboard.writeText(generatedDocument);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);

      toast({
        title: "Texto copiado",
        description: "El contenido se ha copiado al portapapeles",
      });
    } catch (error) {
      console.error("Error al copiar:", error);
      toast({
        title: "Error al copiar",
        description: "No se pudo copiar al portapapeles",
        variant: "destructive",
      });
    }
  };

  const handleDownloadCertificate = async () => {
    if (!pqrData) return;

    setIsDownloading(true);
    try {
      const certificateBase64 = await generatePQRSDCertificate(pqrData);
      const link = document.createElement("a");
      link.href = certificateBase64;
      link.download = `Certificado-PQRSD.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Certificado descargado",
        description:
          "El certificado de radicación se ha descargado correctamente",
      });
    } catch (error) {
      console.error("Error al generar el certificado:", error);
      toast({
        title: "Error",
        description: "No se pudo generar el certificado de radicación",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleGoToDownloadOptions = () => {
    setActiveTab("download");
  };

  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-6 text-center">
        <div className="relative">
          <div className="h-16 w-16 rounded-full bg-green-50 flex items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-green-600" />
          </div>
          <FileText className="h-6 w-6 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-green-600" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-green-700">
            Generando su acción de tutela
          </h3>
          <p className="text-muted-foreground max-w-md">
            Nuestro sistema de inteligencia artificial está redactando su
            documento personalizado con base en la información proporcionada.
          </p>
          <div className="w-full max-w-md mx-auto mt-4">
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-green-600 rounded-full animate-pulse w-4/5"></div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Este proceso puede tomar hasta un minuto. Por favor espere...
          </p>
        </div>
      </div>
    );
  }

  if (!generatedDocument) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4 bg-slate-50 rounded-lg shadow-sm">
        <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center">
          <FileX className="h-8 w-8 text-slate-400" />
        </div>
        <div>
          <p className="text-center font-medium text-lg">
            No hay documento generado
          </p>
          <p className="text-sm text-muted-foreground text-center mt-1 max-w-md">
            Ocurrió un error al procesar su solicitud. Por favor, intente
            nuevamente o contacte a soporte si el problema persiste.
          </p>
        </div>
        <Button variant="default" onClick={onClose} className="mt-2">
          Volver al formulario
        </Button>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col ${activeTab === "download" ? "" : "h-screen"} max-w-6xl mx-auto`}
    >
      <div className="pt-6 pb-4 text-center">
        <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-green-100 mb-2">
          <FileCheck className="h-5 w-5 text-green-600" />
        </div>
        <h3 className="text-green-700 font-semibold text-xl mb-1">
          Acción de Tutela Generada Exitosamente
        </h3>
        {pqrData?.department.entity.name && (
          <div className="text-sm text-muted-foreground">
            Contra: <strong>{pqrData.department.entity.name}</strong>
          </div>
        )}
      </div>

      <div className="flex-1 min-h-0 flex flex-col">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full flex-1 flex flex-col overflow-hidden"
        >
          <TabsList className="mb-4 w-full max-w-md mx-auto grid grid-cols-2">
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <FileText className="h-4 w-4" /> Vista previa
            </TabsTrigger>
            <TabsTrigger value="download" className="flex items-center gap-2">
              <Download className="h-4 w-4" /> Descargar
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-hidden">
            <TabsContent value="preview" className="h-full">
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center mb-4 pb-2">
                  <div className="flex items-center ml-4 gap-2">
                    <Info className="h-4 w-4 text-sky-500" />
                    <span className="text-xs text-muted-foreground">
                      Este documento ha sido generado con inteligencia
                      artificial
                    </span>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 mr-10 bg-white hover:bg-slate-100"
                    onClick={handleCopy}
                  >
                    {copySuccess ? (
                      <>
                        <Check className="h-4 w-4 text-green-500" /> Copiado
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" /> Copiar texto
                      </>
                    )}
                  </Button>
                </div>
                <div className="flex-1 overflow-auto mb-6">
                  <div className="bg-white p-8 border rounded-lg shadow-sm mx-6 mb-6">
                    <h1 className="text-2xl font-bold text-center mb-6">
                      ACCIÓN DE TUTELA
                    </h1>
                    {generatedDocument}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="download" className="h-full overflow-auto pt-2">
              <div className="bg-white p-8 rounded-lg border shadow-sm flex flex-col items-center justify-center space-y-8">
                <div className="text-center space-y-2 max-w-lg">
                  <h4 className="font-medium text-xl text-green-700">
                    Descargue su documentación
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Su acción de tutela está lista. Seleccione el formato en el
                    que desea descargarla para presentar ante la entidad
                    correspondiente.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-xl">
                  <Button
                    variant="outline"
                    className="h-32 flex-col gap-3 border-2 border-red-200 bg-red-50 hover:bg-red-100 hover:border-red-300 transition-all shadow-sm"
                    onClick={handleDownloadPDF}
                    disabled={isDownloading}
                  >
                    {isDownloading ? (
                      <Loader2 className="h-8 w-8 animate-spin text-red-500" />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                        <FileText className="h-6 w-6 text-red-500" />
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="font-medium text-red-700">
                        Formato PDF
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Documento no editable (.pdf)
                      </span>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-32 flex-col gap-3 border-2 border-blue-200 bg-blue-50 hover:bg-blue-100 hover:border-blue-300 transition-all shadow-sm"
                    onClick={handleDownloadWord}
                    disabled={isDownloading}
                  >
                    {isDownloading ? (
                      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <FileText className="h-6 w-6 text-blue-500" />
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="font-medium text-blue-700">
                        Formato Word
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Documento editable (.docx)
                      </span>
                    </div>
                  </Button>
                </div>

                <div className="border-t border-slate-200 w-full max-w-xl pt-6 mt-4 flex flex-col items-center">
                  <h5 className="font-medium text-sm mb-4">
                    Certificados y Comprobantes
                  </h5>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 border-2 border-emerald-200 bg-emerald-50 hover:bg-emerald-100 hover:border-emerald-300 w-full max-w-md h-16 shadow-sm"
                    onClick={handleDownloadCertificate}
                    disabled={isDownloading || !pqrData}
                  >
                    <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                      <FileCheck className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="font-medium text-emerald-700">
                        Certificado de radicación
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Comprobante de envío de su PQRSD
                      </span>
                    </div>
                  </Button>
                </div>

                <div className="text-xs text-muted-foreground text-center max-w-md space-y-2 mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                    <p>
                      Recuerde revisar el contenido de la acción de tutela antes
                      de presentarla oficialmente. Asegúrese de que todos los
                      datos e información incluida sean correctos.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {activeTab === "preview" && (
        <div className="py-4 px-6 bg-white sticky bottom-0">
          <div className="flex gap-3 max-w-md mx-auto">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
          </div>
        </div>
      )}

      {activeTab === "download" && (
        <div className="py-4 px-6 bg-white sticky bottom-0">
          <div className="flex gap-3 max-w-md mx-auto">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Finalizar proceso
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}