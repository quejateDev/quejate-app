import { createPdfWithMembrete, getImageBase64 } from "@/utils/pdfMembrete";
import { typeMap } from "@/constants/pqrMaps";
import { PQR } from "@/types/pqrsd";

export async function GeneratePQRCertificate(data: PQR) {
  const doc = await createPdfWithMembrete("/MembreteWeb.png", "portrait", "a4");
  const membreteImgBase64 = await getImageBase64("/MembreteWeb.png");
  
  const margins = {
    top: 60,
    bottom: 35,
    left: 30,
    right: 30
  };
  
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const maxWidth = pageWidth - margins.left - margins.right;
  let currentY = margins.top;
  const lineHeight = 7;
  const sectionSpacing = 10;

  const checkNewPage = async (requiredSpace: number) => {
    if (currentY + requiredSpace > pageHeight - margins.bottom) {
      doc.addPage();
      const width = doc.internal.pageSize.getWidth();
      const height = doc.internal.pageSize.getHeight();
      doc.addImage(membreteImgBase64, "PNG", 0, 0, width, height);
      currentY = margins.top;
    }
  };

  const addTextWithPageControl = async (text: string, x: number, fontSize: number = 12, fontStyle: string = 'normal', align: string = 'left') => {
    doc.setFontSize(fontSize);
    doc.setFont("helvetica", fontStyle);
    
    const availableWidth = maxWidth - (x - margins.left);
    const textLines = doc.splitTextToSize(text, availableWidth);
    const requiredSpace = textLines.length * lineHeight;
    
    await checkNewPage(requiredSpace);
    
    const startY = currentY;
    
    if (align === 'justify' && textLines.length > 1) {
      textLines.forEach((line: string, index: number) => {
        if (index < textLines.length - 1) { 
          const words = line.trim().split(' ');
          if (words.length > 1) {
            const totalTextWidth = words.reduce((acc, word) => acc + doc.getTextWidth(word), 0);
            const totalSpaceWidth = availableWidth - totalTextWidth;
            const spaceWidth = totalSpaceWidth / (words.length - 1);
            
            let currentX = x;
            words.forEach((word, wordIndex) => {
              doc.text(word, currentX, startY + (index * lineHeight));
              if (wordIndex < words.length - 1) {
                currentX += doc.getTextWidth(word) + spaceWidth;
              }
            });
          } else {
            doc.text(line, x, startY + (index * lineHeight));
          }
        } else {
          doc.text(line, x, startY + (index * lineHeight));
        }
      });
    } else {
      textLines.forEach((line: string, index: number) => {
        doc.text(line, x, startY + (index * lineHeight));
      });
    }
    
    currentY += requiredSpace;
  };

  const addLongTextWithPageBreaks = async (text: string, x: number, fontSize: number = 12, fontStyle: string = 'normal', align: string = 'left') => {
    doc.setFontSize(fontSize);
    doc.setFont("helvetica", fontStyle);
    
    const availableWidth = maxWidth - (x - margins.left);
    const textLines = doc.splitTextToSize(text, availableWidth);
    
    let linesToProcess = [...textLines];
    
    while (linesToProcess.length > 0) {
      const availableSpace = pageHeight - margins.bottom - currentY;
      const maxLinesInCurrentPage = Math.floor(availableSpace / lineHeight);
      
      if (maxLinesInCurrentPage <= 0) {
        await checkNewPage(lineHeight);
        continue;
      }
      
      const linesToWrite = linesToProcess.slice(0, maxLinesInCurrentPage);
      const remainingLines = linesToProcess.slice(maxLinesInCurrentPage);
      
      const startY = currentY;
      
      if (align === 'justify' && linesToWrite.length > 1) {
        linesToWrite.forEach((line: string, index: number) => {
          const isLastLineOfText = remainingLines.length === 0 && index === linesToWrite.length - 1;
          
          if (!isLastLineOfText) { 
            const words = line.trim().split(' ');
            if (words.length > 1) {
              const totalTextWidth = words.reduce((acc, word) => acc + doc.getTextWidth(word), 0);
              const totalSpaceWidth = availableWidth - totalTextWidth;
              const spaceWidth = totalSpaceWidth / (words.length - 1);
              
              let currentX = x;
              words.forEach((word, wordIndex) => {
                doc.text(word, currentX, startY + (index * lineHeight));
                if (wordIndex < words.length - 1) {
                  currentX += doc.getTextWidth(word) + spaceWidth;
                }
              });
            } else {
              doc.text(line, x, startY + (index * lineHeight));
            }
          } else {
            doc.text(line, x, startY + (index * lineHeight));
          }
        });
      } else {
        linesToWrite.forEach((line: string, index: number) => {
          doc.text(line, x, startY + (index * lineHeight));
        });
      }
      
      currentY += linesToWrite.length * lineHeight;
      linesToProcess = remainingLines;
      
      if (linesToProcess.length > 0) {
        await checkNewPage(lineHeight);
      }
    }
  };

  try {
    doc.setFontSize(16);
    doc.setTextColor(40, 40, 40);
    doc.text("CERTIFICADO DE RADICACIÓN PQRSD", pageWidth / 2, currentY, {
      align: "center",
    });
    currentY += 10;

    doc.setDrawColor(200, 200, 200);
    doc.line(margins.left, currentY, pageWidth - margins.right, currentY);
    currentY += sectionSpacing * 1.5;

    doc.setFontSize(12);
    doc.setTextColor(80, 80, 80);

    doc.setFont("helvetica", "bold");
    doc.text("Información de la Solicitud", margins.left, currentY);
    currentY += lineHeight * 1.5;

    doc.setFont("helvetica", "normal");

    await addTextWithPageControl(
      `Fecha de Creación: ${formatDate(data.createdAt)}`,
      margins.left
    );

    const requestType = typeMap[data.type]?.label || data.type;
    await addTextWithPageControl(`Tipo de Solicitud: ${requestType}`, margins.left);

    await addTextWithPageControl(
      `Entidad: ${data.entity?.name || "No especificada"}`,
      margins.left
    );
    
    currentY += sectionSpacing;

    await checkNewPage(25);
    doc.setFont("helvetica", "bold");
    doc.text("Información del Solicitante", margins.left, currentY);
    currentY += lineHeight * 1.5;

    doc.setFont("helvetica", "normal");
    if (data.anonymous) {
      await addTextWithPageControl("Solicitud realizada de forma anónima", margins.left);
    } else if (data.creator) {
      await addTextWithPageControl(
        `Nombre: ${data.creator.firstName} ${data.creator.lastName}`,
        margins.left
      );
    } else {
      await addTextWithPageControl("Información del solicitante no disponible", margins.left);
    }
    currentY += sectionSpacing;

    await checkNewPage(25);
    doc.setFont("helvetica", "bold");
    doc.text("Detalles de la Solicitud", margins.left, currentY);
    currentY += lineHeight * 1.5;

    doc.setFont("helvetica", "normal");
    if (data.subject) {
      await addTextWithPageControl(`Asunto: ${data.subject}`, margins.left);
    }

    if (data.description) {
      await checkNewPage(lineHeight * 2);
      doc.text("Descripción:", margins.left, currentY);
      currentY += lineHeight;

      await addLongTextWithPageBreaks(data.description, margins.left, 12, 'normal', 'justify');
      currentY += sectionSpacing;
    }

    if (data.attachments && data.attachments.length > 0) {
      await checkNewPage(20);

      doc.setFont("helvetica", "bold");
      doc.text("Archivos Adjuntos", margins.left, currentY);
      currentY += lineHeight * 1.5;

      doc.setFont("helvetica", "normal");
      for (const file of data.attachments) {
        await checkNewPage(lineHeight * 2);

        const fileInfo = `- ${file.type} (${formatFileSize(file.size)})`;
        const availableWidth = maxWidth - doc.getTextWidth("Ver Archivo") - 10;
        const fileLines = doc.splitTextToSize(fileInfo, availableWidth);
        
        fileLines.forEach((line: string, index: number) => {
          doc.text(line, margins.left, currentY + (index * lineHeight));
        });

        const espacioExtra = 5;
        doc.setTextColor(0, 0, 255);
        doc.textWithLink(
          "Ver Archivo",
          margins.left + doc.getTextWidth(fileLines[0]) + espacioExtra,
          currentY,
          {
            url: file.url,
            underline: true,
          }
        );
        doc.setTextColor(0, 0, 0);

        currentY += lineHeight * fileLines.length;
      }
      currentY += sectionSpacing;
    }

    await checkNewPage(lineHeight * 2); 
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    
    doc.setTextColor(0, 0, 255);
    doc.textWithLink(
      "Ver detalle de la PQRSD en la plataforma",
      margins.left,
      currentY,
      {
        url: `https://quejate.com.co/dashboard/pqr/${data.id}`,
        underline: true,
      }
    );
    doc.setTextColor(100, 100, 100);
    
    currentY += lineHeight + sectionSpacing;
    
    const certText = "Este documento certifica que la solicitud fue enviada correctamente y se encuentra registrada en nuestro sistema. El presente certificado sirve como comprobante de radicación de su PQRSD.";
    await addLongTextWithPageBreaks(certText, margins.left, 10, 'normal', 'justify');

    const currentDate = new Date();
    await addTextWithPageControl(
      `Certificado generado el: ${currentDate.toLocaleDateString()} a las ${currentDate.toLocaleTimeString()}`,
      margins.left,
      10
    );
  } catch (error) {
    console.error("Error al generar el certificado:", error);
    throw error;
  }

  return doc.output('blob');
}

function formatDate(date: Date | string): string {
  if (!date) return "No disponible";

  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) {
      return typeof date === "string" ? date : "Fecha inválida";
    }
    return dateObj.toLocaleDateString();
  } catch (error) {
    return typeof date === "string" ? date : "Fecha inválida";
  }
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}