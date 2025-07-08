import jsPDF from "jspdf";

export async function getImageBase64(url: string): Promise<string> {
  const res = await fetch(url);
  const blob = await res.blob();
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Agrega el membrete de fondo y el isotipo en el centro de cada página del PDF.
 * @param doc Instancia de jsPDF
 * @param membreteUrl Ruta pública del PNG de fondo (por defecto: "/MembreteWeb.png")
 * @param isotipoUrl Ruta pública del PNG del isotipo (por defecto: "/IsotipoVector.png")
 */
export async function addMembreteBackground(
  doc: jsPDF,
  membreteUrl = "/MembreteWeb.png",
  isotipoUrl = "/IsotipoVector.png",
  onlyCurrentPage?: boolean,
  membreteImgBase64?: string,
  isotipoImgBase64?: string
) {
  let membreteImg = membreteImgBase64;
  let isotipoImg = isotipoImgBase64;
  if (!membreteImg || !isotipoImg) {
    [membreteImg, isotipoImg] = await Promise.all([
      getImageBase64(membreteUrl),
      getImageBase64(isotipoUrl)
    ]);
  }

  if (onlyCurrentPage) {
    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();
    doc.addImage(membreteImg, "PNG", 0, 0, width, height);
    const isotipoWidth = width * 0.4;
    const isotipoHeight = isotipoWidth;
    const isotipoX = (width - isotipoWidth) / 2;
    const isotipoY = height / 2 - isotipoHeight / 2;
    doc.addImage(isotipoImg, "PNG", isotipoX, isotipoY, isotipoWidth, isotipoHeight);
  } else {
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      const width = doc.internal.pageSize.getWidth();
      const height = doc.internal.pageSize.getHeight();
      doc.addImage(membreteImg, "PNG", 0, 0, width, height);
      const isotipoWidth = width * 0.4;
      const isotipoHeight = isotipoWidth;
      const isotipoX = (width - isotipoWidth) / 2;
      const isotipoY = height / 2 - isotipoHeight / 2;
      doc.addImage(isotipoImg, "PNG", isotipoX, isotipoY, isotipoWidth, isotipoHeight);
    }
  }
}