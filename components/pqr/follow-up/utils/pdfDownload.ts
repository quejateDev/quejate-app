import { PdfDownloadError } from "../services/pqrFollowUpService";

/**
 * Entrega un fichero al navegador como descarga, con su propio nombre.
 *
 * La URL del blob se revoca un rato después y no en el acto: algún navegador
 * cancela la descarga si la URL desaparece antes de empezar a leerla.
 */
export function saveFile(file: File): void {
  const url = URL.createObjectURL(file);

  const link = document.createElement("a");
  link.href = url;
  link.download = file.name;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  setTimeout(() => URL.revokeObjectURL(url), 30000);
}

/**
 * Título y texto del aviso cuando un PDF no llega.
 *
 * @param notFound - Qué decir ante un 404, que depende de qué se pedía: un
 *   documento caducado, o el certificado de una PQRSD que no es de quien lo
 *   pide.
 */
export function describePdfError(
  error: unknown,
  notFound: string
): { title: string; description: string } {
  if (error instanceof PdfDownloadError) {
    switch (error.status) {
      case 404:
        return { title: "No disponible", description: notFound };
      case 401:
        return {
          title: "Sesión caducada",
          description: "Vuelve a iniciar sesión e inténtalo de nuevo.",
        };
      case 429:
        return {
          title: "Demasiadas descargas",
          description: "Espera unos minutos e inténtalo de nuevo.",
        };
    }
  }

  return {
    title: "Error",
    description: "No se pudo descargar el PDF. Inténtalo de nuevo en unos minutos.",
  };
}
