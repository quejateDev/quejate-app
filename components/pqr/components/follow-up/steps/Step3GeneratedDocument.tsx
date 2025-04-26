import { Button } from "@/components/ui/button";
import type { StepProps } from "../types";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { Copy, Download, FileText, Loader2, FileType } from "lucide-react";
import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Packer,
} from "docx";
import saveAs from "file-saver";

export function Step3GeneratedDocument({
  generatedDocument,
  onClose,
  pqrData,
}: StepProps & { generatedDocument: string | null }) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [activeTab, setActiveTab] = useState("preview");

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

  const handleDownloadText = () => {
    const blob = new Blob([generatedDocument || ""], { type: "text/plain" });
    saveAs(blob, `tutela_${pqrData?.entity || "documento"}.txt`);

    toast({
      title: "Documento descargado",
      description: "El archivo de texto se ha descargado correctamente",
    });
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

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(generatedDocument);
        toast({
          title: "Texto copiado",
          description: "El contenido se ha copiado al portapapeles",
        });
        return;
      }

      const textarea = document.createElement("textarea");
      textarea.value = generatedDocument;
      textarea.style.position = "fixed";
      document.body.appendChild(textarea);
      textarea.select();

      try {
        const successful = document.execCommand("copy");
        if (!successful) throw new Error("Falló execCommand");

        toast({
          title: "Texto copiado",
          description:
            "El contenido se ha copiado al portapapeles (método alternativo)",
        });
      } finally {
        document.body.removeChild(textarea);
      }
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

  if (!generatedDocument) {
    return (
      <div className="flex items-center justify-center p-8">
        <p>No hay documento generado</p>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col ${activeTab === "download" ? "" : "h-screen"} max-w-6xl mx-auto`}
    >
      <div className="pt-4 pb-4 text-center">
        <h3 className="text-green-600 font-semibold text-lg mb-2">
          Acción de Tutela Generada
        </h3>
        {pqrData?.entity && (
          <div className="text-sm text-muted-foreground">
            Contra: <strong>{pqrData.entity}</strong>
          </div>
        )}
      </div>

      <div className="flex-1 min-h-0 flex flex-col">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full flex-1 flex flex-col overflow-hidden"
        >
          <TabsList className="grid grid-cols-2 mb-2">
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <FileText className="h-4 w-4" /> Vista previa
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-hidden">
            <TabsContent value="preview" className="h-full">
              <div className="h-full overflow-auto bg-background p-6 border rounded-md relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={handleCopy}
                >
                  <Copy className="h-4 w-4 mr-2" /> Copiar
                </Button>
                <pre className="whitespace-pre-wrap text-sm max-w-full">
                  {generatedDocument}
                </pre>
              </div>
            </TabsContent>

            <TabsContent value="download" className="h-full overflow-auto pt-2">
              <div className="bg-gray-50 p-6 rounded-md border flex flex-col items-center justify-center space-y-6">
                <div className="text-center space-y-2">
                  <h4 className="font-medium">Formatos disponibles</h4>
                  <p className="text-sm text-muted-foreground">
                    Selecciona el formato en el que deseas descargar tu
                    documento
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                  <Button
                    variant="outline"
                    className="flex-1 h-20 flex-col gap-2"
                    onClick={handleDownloadText}
                  >
                    <FileText className="h-6 w-6" />
                    <span>Texto (.txt)</span>
                  </Button>

                  <Button
                    variant="default"
                    className="flex-1 h-20 flex-col gap-2 bg-blue-600 hover:bg-blue-700"
                    onClick={handleDownloadWord}
                    disabled={isDownloading}
                  >
                    {isDownloading ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                      <FileType className="h-6 w-6" />
                    )}
                    <span>Word (.docx)</span>
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground text-center max-w-md">
                  El formato Word (.docx) es recomendado para presentar ante
                  entidades oficiales y permite editar el documento
                  posteriormente si es necesario.
                </p>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {activeTab !== "download" && (
        <div className="py-3 border-t bg-background sticky bottom-0">
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cerrar
            </Button>
            <Button
              onClick={handleGoToDownloadOptions}
              variant="secondary"
              className="flex-1"
            >
              <Download className="h-4 w-4 mr-2" />
              Opciones de descarga
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
