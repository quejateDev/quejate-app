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

export async function createPdfWithMembrete(
  membreteUrl = "/MembreteWeb.png",
  orientation: 'portrait' | 'landscape' = 'portrait',
  format: string = 'a4'
): Promise<jsPDF> {
  const doc = new jsPDF({
    orientation,
    unit: 'mm',
    format
  });
  
  const membreteImg = await getImageBase64(membreteUrl);

  const width = doc.internal.pageSize.getWidth();
  const height = doc.internal.pageSize.getHeight();
  doc.addImage(membreteImg, "PNG", 0, 0, width, height);
  
  return doc;
}