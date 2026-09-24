import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";


import { PQR } from "@/types/pqrsd";
import { toast } from "@/hooks/use-toast";
import { pqrFollowUpService } from "../services/pqrFollowUpService";
import { describePdfError, saveFile } from "../utils/pdfDownload";
import {
  LEGAL_DOC_NOT_SAVED_NOTICE,
  LEGAL_DOC_UNAVAILABLE,
} from "../constants/legalDocsCopy";

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
import { LegalDocumentNotices } from "./LegalDocumentNotices";

interface StepProps {
  onClose: () => void;
  pqrData: PQR;
}

export function DocumentExport({
  generatedDocument,
  documentId,
  onClose,
  pqrData,
  isGenerating = false,
}: StepProps & {
  generatedDocument: string | null;
  /** Id del documento guardado en el backend; sin él no hay PDF. */
  documentId: string | null;
  isGenerating?: boolean;
}) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloadingCertificate, setIsDownloadingCertificate] = useState(false);
  const [activeTab, setActiveTab] = useState("preview");
  const [copySuccess, setCopySuccess] = useState(false);

  const handleDownloadPDF = async () => {
    if (!documentId) return;

    setIsDownloading(true);
    try {
      // El PDF lo maqueta el backend a partir del texto que guardó al
      // generar, y se descarga con el nombre que él le pone (`tutela.pdf`).
      saveFile(await pqrFollowUpService.getLegalDocumentPdf(documentId));

      toast({
        title: "Documento descargado",
        description: "El archivo PDF se ha descargado correctamente",
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
    // Sin mirar `pqrData.creator` ni `anonymous`: quién puede pedirlo lo
    // decide el backend (solo el autor), y su 404 se enseña como «no
    // disponible».
    setIsDownloadingCertificate(true);
    try {
      saveFile(await pqrFollowUpService.getCertificatePdf(pqrData.id));

      toast({
        title: "Documento descargado",
        description: "El certificado PDF se ha descargado correctamente",
      });
    } catch (error) {
      console.error("Error al descargar el certificado:", error);
      toast({
        ...describePdfError(
          error,
          "El certificado de esta PQRSD no está disponible."
        ),
        variant: "destructive",
      });
    } finally {
      setIsDownloadingCertificate(false);
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
    <div className="flex flex-col max-w-6xl mx-auto h-full">
      <div className="pt-6 pb-4 text-center">
        <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-green-100 mb-2">
          <FileCheck className="h-5 w-5 text-green-600" />
        </div>
        <h3 className="text-green-700 font-semibold text-xl mb-1">
          Acción de Tutela Generada Exitosamente
        </h3>
        {pqrData?.entity?.name && (
          <div className="text-sm text-muted-foreground">
            Contra: <strong>{pqrData.entity.name}</strong>
          </div>
        )}
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full flex flex-col flex-1 overflow-hidden"
      >
        <TabsList className="mb-4 w-full max-w-md mx-auto grid grid-cols-2">
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <FileText className="h-4 w-4" /> Vista previa
          </TabsTrigger>
          <TabsTrigger value="download" className="flex items-center gap-2">
            <Download className="h-4 w-4" /> Descargar
          </TabsTrigger>
        </TabsList>

        <TabsContent 
          value="preview" 
          className="overflow-auto flex-1"
          style={{ height: "calc(100% - 120px)" }}
        >
          <div className="flex flex-col">
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
                className="flex items-center gap-1 mr-4 bg-white hover:bg-slate-100"
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
            
            <div className="overflow-auto px-4 pb-6">
              <div className="mb-4">
                <LegalDocumentNotices saved={!!documentId} />
              </div>
              <div className="bg-white p-6 md:p-8 border rounded-lg shadow-sm mb-6">
                <h1 className="text-2xl font-bold text-center mb-6">
                  ACCIÓN DE TUTELA
                </h1>
                <div className="whitespace-pre-wrap text-justify leading-relaxed">
                  {generatedDocument}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent 
          value="download" 
          className="overflow-auto flex-1"
          style={{ height: "calc(100% - 120px)" }}
        >
          <div className="bg-white p-4 md:p-8 rounded-lg border shadow-sm flex flex-col items-center justify-center space-y-6 mx-4 mb-4">
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

            <div className="grid grid-cols-1 gap-4 w-full max-w-xl">
              <Button
                variant="outline"
                className="h-24 md:h-32 flex-col gap-2 md:gap-3 border-2 border-red-200 bg-red-50 hover:bg-red-100 hover:border-red-300 transition-all shadow-sm"
                onClick={handleDownloadPDF}
                disabled={isDownloading || !documentId}
              >
                {isDownloading ? (
                  <Loader2 className="h-6 w-6 md:h-8 md:w-8 animate-spin text-red-500" />
                ) : (
                  <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-red-100 flex items-center justify-center">
                    <FileText className="h-5 w-5 md:h-6 md:w-6 text-red-500" />
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="font-medium text-red-700">
                    Tutela
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Documento no editable (.pdf)
                  </span>
                </div>
              </Button>
              {!documentId && (
                <p className="text-xs text-red-700 text-center">
                  {LEGAL_DOC_NOT_SAVED_NOTICE}
                </p>
              )}
            </div>

            <div className="border-t border-slate-200 w-full max-w-xl pt-6 mt-2 flex flex-col items-center">
              <h5 className="font-medium text-sm mb-4">
                Certificados y Comprobantes
              </h5>
              <Button
                variant="outline"
                className="flex items-center gap-2 border-2 border-emerald-200 bg-emerald-50 hover:bg-emerald-100 hover:border-emerald-300 w-full max-w-md h-16 shadow-sm"
                onClick={handleDownloadCertificate}
                disabled={isDownloading || isDownloadingCertificate || !pqrData}
              >
                <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                  {isDownloadingCertificate ? (
                    <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
                  ) : (
                    <FileCheck className="h-4 w-4 text-emerald-600" />
                  )}
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

            <div className="text-xs text-muted-foreground text-center max-w-md space-y-2 mt-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                <p>
                  Recuerde revisar el contenido de la acción de tutela antes
                  de presentarla oficialmente. Asegúrese de que todos los
                  datos e información incluida sean correctos.
                </p>
              </div>
            </div>

            <div className="text-xs text-muted-foreground text-start max-w-md mt-4 p-3 bg-slate-100 rounded-lg border border-slate-200">
              <p>
                Una vez descargados los documentos necesarios, puede dirigirse al siguiente enlace para subir la tutela:&nbsp;
                <a
                  href="https://procesojudicial.ramajudicial.gov.co/tutelaenlinea"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  https://procesojudicial.ramajudicial.gov.co/tutelaenlinea
                </a>
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="py-4 px-6 bg-white border-t mt-auto">
        <div className="flex gap-3 max-w-md mx-auto">
          <Button variant="outline" onClick={onClose} className="flex-1">
            {activeTab === "download" ? "Finalizar proceso" : "Cancelar"}
          </Button>
        </div>
      </div>
    </div>
  );

}
