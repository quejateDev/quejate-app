'use client';

import { useCallback, useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, Clock, Download, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';
import { useFullUser } from '@/components/UserProvider';
import { formatDateWithoutTime } from '@/lib/dateUtils';
import {
  PdfDownloadError,
  pqrFollowUpService,
} from '@/components/pqr/follow-up/services/pqrFollowUpService';
import { describePdfError, saveFile } from '@/components/pqr/follow-up/utils/pdfDownload';
import { LegalDocumentDraftNotice } from '@/components/pqr/follow-up/components/LegalDocumentNotices';
import {
  LEGAL_DOC_UNAVAILABLE,
  LEGAL_DOCS_HISTORY_RETENTION_NOTICE,
} from '@/components/pqr/follow-up/constants/legalDocsCopy';
import { LegalDocumentDetail, LegalDocumentSummary } from '@/types/legal-document';

/**
 * «Mis documentos legales»: las tutelas y los oficios a entes de control que
 * el titular ha generado, guardados por el backend seis meses (Tareas 26 y
 * 27). Es el equivalente web de la pantalla de la app móvil.
 *
 * Que cada documento lo vea solo su titular lo decide el backend en cada ruta
 * (401 sin sesión, 404 para lo ajeno). La página está además en
 * `privateRoutes`, así que sin sesión el middleware manda al login antes de
 * pintar nada.
 */
export default function LegalDocumentsPage() {
  const currentUser = useFullUser();
  const [documents, setDocuments] = useState<LegalDocumentSummary[] | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);

  const loadDocuments = useCallback(async () => {
    setLoadFailed(false);
    try {
      setDocuments(await pqrFollowUpService.listLegalDocuments());
    } catch (error) {
      console.error('Error al cargar los documentos legales:', error);
      setLoadFailed(true);
    }
  }, []);

  useEffect(() => {
    if (currentUser?.id) {
      loadDocuments();
    }
  }, [currentUser?.id, loadDocuments]);

  if (!currentUser) {
    return (
      <div className="container mx-auto p-4">
        <p className="text-muted-foreground">Por favor inicia sesión para ver tus documentos</p>
      </div>
    );
  }

  const renderContent = () => {
    if (loadFailed) {
      return (
        <div className="flex flex-col items-center gap-3 py-8 text-center">
          <p className="text-muted-foreground">No se pudieron cargar tus documentos.</p>
          <Button variant="outline" onClick={loadDocuments}>
            Reintentar
          </Button>
        </div>
      );
    }

    if (documents === null) {
      return (
        <div className="space-y-3">
          {[...Array(3)].map((_, index) => (
            <Skeleton key={index} className="h-20 w-full" />
          ))}
        </div>
      );
    }

    if (documents.length === 0) {
      return (
        <div className="py-8 text-center">
          <p className="font-medium">Aún no tienes documentos legales</p>
          <p className="text-sm text-muted-foreground mt-1">
            Aquí aparecerán las tutelas y los oficios a entes de control que
            generes desde una PQRSD vencida.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {documents.map((item) => (
          <LegalDocumentRow key={item.id} item={item} onGone={loadDocuments} />
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-2xl font-semibold mb-4">Mis documentos legales</h1>

      <div className="flex items-start gap-2 p-3 mb-6 rounded-lg border border-amber-200 bg-amber-50 text-sm text-amber-800">
        <Clock className="h-4 w-4 flex-shrink-0 mt-0.5" />
        <p>{LEGAL_DOCS_HISTORY_RETENTION_NOTICE}</p>
      </div>

      {renderContent()}
    </div>
  );
}

/**
 * Una fila del historial: rótulo del backend, fechas, descarga del PDF y el
 * texto, que se pide solo al abrirlo (el historial llega sin él).
 *
 * @param onGone - Se llama cuando el backend dice que el documento ya no
 *   existe: venció con la página abierta, y la lista debe dejar de mostrarlo.
 */
function LegalDocumentRow({
  item,
  onGone,
}: {
  item: LegalDocumentSummary;
  onGone: () => void;
}) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  // `undefined`: aún sin pedir; `null`: el backend respondió 404.
  const [detail, setDetail] = useState<LegalDocumentDetail | null | undefined>(undefined);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      saveFile(await pqrFollowUpService.getLegalDocumentPdf(item.id));
    } catch (error) {
      console.error('Error al descargar el PDF:', error);
      toast({
        ...describePdfError(error, LEGAL_DOC_UNAVAILABLE),
        variant: 'destructive',
      });
      if (error instanceof PdfDownloadError && error.status === 404) {
        onGone();
      }
    } finally {
      setIsDownloading(false);
    }
  };

  const handleToggleText = async () => {
    const opening = !isOpen;
    setIsOpen(opening);
    if (!opening || detail !== undefined) return;

    try {
      setDetail(await pqrFollowUpService.getLegalDocument(item.id));
    } catch (error) {
      console.error('Error al cargar el documento:', error);
      toast({
        title: 'Error',
        description: 'No se pudo cargar el texto del documento. Inténtalo de nuevo.',
        variant: 'destructive',
      });
      setIsOpen(false);
    }
  };

  const renderText = () => {
    if (detail === undefined) {
      return (
        <div className="flex justify-center py-4">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      );
    }

    if (detail === null) {
      return <p className="text-sm text-muted-foreground">{LEGAL_DOC_UNAVAILABLE}</p>;
    }

    return (
      <div className="space-y-4">
        <LegalDocumentDraftNotice />
        <div className="whitespace-pre-wrap text-sm text-justify leading-relaxed">
          {detail.content}
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div className="min-w-0">
              {/* El rótulo del backend, no uno derivado del tipo. */}
              <p className="font-semibold break-words">{item.title}</p>
              <p className="text-xs text-muted-foreground">
                Generado el {formatDateWithoutTime(item.createdAt)}
              </p>
              <p className="text-xs text-amber-700">
                Disponible hasta el {formatDateWithoutTime(item.expiresAt)}
              </p>
            </div>
          </div>

          <div className="flex gap-2 sm:flex-shrink-0">
            <Button variant="outline" size="sm" onClick={handleToggleText}>
              {isOpen ? (
                <ChevronUp className="h-4 w-4 mr-1" />
              ) : (
                <ChevronDown className="h-4 w-4 mr-1" />
              )}
              {isOpen ? 'Ocultar texto' : 'Ver texto'}
            </Button>
            <Button size="sm" onClick={handleDownload} disabled={isDownloading}>
              {isDownloading ? (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <Download className="h-4 w-4 mr-1" />
              )}
              Descargar PDF
            </Button>
          </div>
        </div>

        {isOpen && <div className="mt-4 border-t pt-4">{renderText()}</div>}
      </CardContent>
    </Card>
  );
}
