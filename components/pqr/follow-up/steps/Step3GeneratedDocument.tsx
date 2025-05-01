import { Button } from "@/components/ui/button";
import type { StepProps } from "../types";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { Copy, Download, Loader2, InfoIcon, FileText, Check, FileX } from "lucide-react";
import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Packer,
} from "docx";
import saveAs from "file-saver";
import jsPDF from "jspdf";

export function Step3GeneratedDocument({
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
      saveAs(blob, `tutela_${pqrData?.entity || "documento"}.docx`);

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
  
    try {
      const doc = new jsPDF();
      
      const margin = 20;
      const pageWidth = doc.internal.pageSize.getWidth();
      const maxWidth = pageWidth - (margin * 2);
      const lineHeight = 7;
      let yPosition = 30;
      
    
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("ACCIÓN DE TUTELA", pageWidth / 2, 20, { align: "center" });

      yPosition = 40;
      
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      

      const lines = generatedDocument.split('\n');
      
      lines.forEach(line => {
        if (line.trim() === '') {
          yPosition += lineHeight;
          return;
        }
        
        if (line.match(/^(HECHOS:|DERECHOS VULNERADOS:|PRETENSIONES:)/i)) {
          doc.setFontSize(12);
          doc.setFont("helvetica", "bold");
          const textLines = doc.splitTextToSize(line, maxWidth);
          doc.text(textLines, margin, yPosition);
          yPosition += (textLines.length * lineHeight) + 2;
          doc.setFontSize(11);
          doc.setFont("helvetica", "normal");
          return;
        }
        
        if (line.match(/^\d+\./)) {
          const parts = line.split('.');
          doc.setFont("helvetica", "bold");
          doc.text(parts[0] + '.', margin, yPosition);
          doc.setFont("helvetica", "normal");
          const remainingText = parts.slice(1).join('.').trim();
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
      
      doc.save(`tutela_${pqrData?.entity || "documento"}.pdf`);
  
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

  const handleGoToDownloadOptions = () => {
    setActiveTab("download");
  };

  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-6 text-center">
        <div className="relative">
          <Loader2 className="h-12 w-12 animate-spin text-green-600" />
          <FileText className="h-6 w-6 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-green-600" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">Generando su acción de tutela</h3>
          <p className="text-muted-foreground max-w-md">
            Nuestro sistema de inteligencia artificial está redactando su documento personalizado 
            con base en la información proporcionada.
          </p>
          <div className="w-full max-w-xs mx-auto mt-4">
            <div className="h-2 bg-slate-100 rounded overflow-hidden">
              <div className="h-full bg-green-600 rounded animate-pulse"></div>
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
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <FileX className="h-12 w-12 text-slate-300" />
        <div>
          <p className="text-center">No hay documento generado</p>
          <p className="text-sm text-muted-foreground text-center mt-1">
            Ocurrió un error al procesar su solicitud. Por favor, intente nuevamente.
          </p>
        </div>
        <Button variant="outline" onClick={onClose}>
          Volver
        </Button>
      </div>
    );
  }

  return (
    <div className={`flex flex-col ${activeTab === "download" ? "" : "h-screen"} max-w-6xl mx-auto`}>
      <div className="pt-4 pb-4 text-center">

        <h3 className="text-green-600 font-semibold text-lg mb-2">Acción de Tutela Generada</h3>
        {pqrData?.entity && (
          <div className="text-sm text-muted-foreground">
            Contra: <strong>{pqrData.entity}</strong>
          </div>
        )}
      </div>

      <div className="flex-1 min-h-0 flex flex-col">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid grid-cols-2 mb-2">
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <FileText className="h-4 w-4" /> Vista previa
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-hidden">
            <TabsContent value="preview" className="h-full">
              <div className="h-full overflow-auto bg-background p-6 border rounded-md relative">
                <div className="sticky top-0 right-0 flex justify-between items-center mb-4 pb-2 border-b bg-background z-10">
                  <div className="flex items-center gap-2">
                    <InfoIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Este documento ha sido generado con inteligencia artificial</span>
                  </div>
                  
                  <Button variant="ghost" size="sm" className="flex items-center gap-1" onClick={handleCopy}>
                    {copySuccess ? (
                      <>
                        <Check className="h-4 w-4 text-green-500" /> Copiado
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" /> Copiar
                      </>
                    )}
                  </Button>
                </div>
                <pre className="whitespace-pre-wrap text-sm max-w-full">{generatedDocument}</pre>
              </div>
            </TabsContent>

            <TabsContent value="download" className="h-full overflow-auto pt-2">
              <div className="bg-gray-50 p-6 rounded-md border flex flex-col items-center justify-center space-y-6">
                <div className="text-center space-y-2 max-w-md">
                  <h4 className="font-medium">Descarga tu acción de tutela</h4>
                  <p className="text-sm text-muted-foreground">
                    Tu documento está listo. Selecciona el formato en el que deseas descargarlo para presentar ante la entidad correspondiente.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                  <Button
                    variant="outline"
                    className="flex-1 h-24 flex-col gap-2 bg-red-400 hover:bg-red-400"
                    onClick={handleDownloadPDF}
                  >
                    <FileText className="h-8 w-8 text-white" />
                    <div className="flex flex-col text-white">
                      <span>PDF (.pdf)</span>
                      <span className="text-xs">Formato no editable</span>
                    </div>
                  </Button>

                  <Button
                    variant="default"
                    className="flex-1 h-24 flex-col gap-2 bg-blue-400 hover:bg-blue-400"
                    onClick={handleDownloadWord}
                    disabled={isDownloading}
                  >
                    {isDownloading ? (
                      <Loader2 className="h-8 w-8 animate-spin" />
                    ) : (
                      <FileText className="h-8 w-8" />
                    )}
                    <div className="flex flex-col">
                      <span>Word (.docx)</span>
                      <span className="text-xs">Formato editable</span>
                    </div>
                  </Button>
                </div>

                <div className="text-xs text-muted-foreground text-center max-w-md space-y-2">
                  <p className="pt-2">
                    <InfoIcon className="h-3.5 w-3.5 inline mr-1" />
                    Recuerde revisar el contenido antes de presentarlo oficialmente.
                  </p>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {activeTab === "preview" && (
        <div className="py-3 border-t bg-background sticky bottom-0">
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cerrar
            </Button>
            <Button onClick={handleGoToDownloadOptions} variant="secondary" className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Descargar documento
            </Button>
          </div>
        </div>
      )}

      {activeTab === "download" && (
        <div className="py-3 border-t bg-background sticky bottom-0">
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Finalizar proceso
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}