"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useFullUser } from "@/components/UserProvider";
import { pqrFollowUpService } from "./follow-up/services/pqrFollowUpService";
import { describePdfError, saveFile } from "./follow-up/utils/pdfDownload";

type CertificateDownloadButtonProps = {
  pqrId: string;
  /**
   * Autor de la PQRSD según el backend. En una anónima solo le llega al propio
   * autor: a cualquier otro se le envía `null` (H-18).
   */
  creatorId: string | null;
};

/**
 * El certificado de radicación en PDF → `GET /api/pqr/:id/certificate.pdf`.
 *
 * Quién puede descargarlo lo decide el backend: **solo el autor**, y a
 * cualquier otro le responde 404. Aquí solo se decide si se enseña el botón,
 * para no ofrecerle a un visitante algo que acabaría en «no disponible». Se
 * exigen los dos identificadores antes de compararlos: sin sesión y en una
 * anónima, los dos lados estarían vacíos y se darían por iguales.
 */
export function CertificateDownloadButton({
  pqrId,
  creatorId,
}: CertificateDownloadButtonProps) {
  const user = useFullUser();
  const [isDownloading, setIsDownloading] = useState(false);

  if (!user?.id || !creatorId || user.id !== creatorId) return null;

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      saveFile(await pqrFollowUpService.getCertificatePdf(pqrId));

      toast({
        title: "Documento descargado",
        description: "El certificado de radicación se ha descargado correctamente",
      });
    } catch (error) {
      console.error("Error al descargar el certificado:", error);
      toast({
        ...describePdfError(error, "El certificado de esta PQRSD no está disponible."),
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Button onClick={handleDownload} disabled={isDownloading} variant="outline">
      {isDownloading ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <Download className="h-4 w-4 mr-2" />
      )}
      Descargar certificado de radicación
    </Button>
  );
}
