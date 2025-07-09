import { jsPDF } from "jspdf";
// import logo from "@/public/logo2.svg";
import { typeMap } from "@/constants/pqrMaps";
import { PQR } from "@/types/pqrsd";

export async function GeneratePQRCertificate(data: PQR) {
  const doc = new jsPDF();
  const margin = 15;
  let currentY = margin;
  const maxY = 280;
  const lineHeight = 7;
  const sectionSpacing = 10;

  const checkNewPage = (requiredSpace: number) => {
    if (currentY + requiredSpace > maxY) {
      doc.addPage();
      currentY = margin;
    }
  };

  try {
    // const logoImage = await loadImage(logo.src);
    // doc.addImage(logoImage, "PNG", margin, currentY, 40, 20);
    currentY += 30;

    doc.setFontSize(16);
    doc.setTextColor(40, 40, 40);
    doc.text("CERTIFICADO DE RADICACIÓN PQRSD", 105, currentY, {
      align: "center",
    });
    currentY += 10;

    doc.setDrawColor(200, 200, 200);
    doc.line(margin, currentY, 195, currentY);
    currentY += sectionSpacing * 1.5;

    doc.setFontSize(12);
    doc.setTextColor(80, 80, 80);

    doc.setFont("helvetica", "bold");
    doc.text("Información de la Solicitud", margin, currentY);
    currentY += lineHeight * 1.5;

    doc.setFont("helvetica", "normal");

    doc.text(
      `Fecha de Creación: ${formatDate(data.createdAt)}`,
      margin,
      currentY
    );
    currentY += lineHeight;

    const requestType = typeMap[data.type]?.label || data.type;
    doc.text(`Tipo de Solicitud: ${requestType}`, margin, currentY);
    currentY += lineHeight;

    doc.text(
      `Entidad: ${data.entity?.name || "No especificada"}`,
      margin,
      currentY
    );
    currentY += sectionSpacing * 2;

    checkNewPage(25);
    doc.setFont("helvetica", "bold");
    doc.text("Información del Solicitante", margin, currentY);
    currentY += lineHeight * 1.5;

    doc.setFont("helvetica", "normal");
    if (data.anonymous) {
      doc.text("Solicitud realizada de forma anónima", margin, currentY);
    } else if (data.creator) {
      doc.text(
        `Nombre: ${data.creator.firstName} ${data.creator.lastName}`,
        margin,
        currentY
      );
    } else {
      doc.text("Información del solicitante no disponible", margin, currentY);
    }
    currentY += sectionSpacing * 2;

    checkNewPage(25);
    doc.setFont("helvetica", "bold");
    doc.text("Detalles de la Solicitud", margin, currentY);
    currentY += lineHeight * 1.5;

    doc.setFont("helvetica", "normal");
    if (data.subject) {
      doc.text(`Asunto: ${data.subject}`, margin, currentY);
      currentY += lineHeight;
    }

    if (data.description) {
      checkNewPage(20);
      doc.text("Descripción:", margin, currentY);
      currentY += lineHeight;

      const descriptionLines = doc.splitTextToSize(data.description, 180);
      for (const line of descriptionLines) {
        checkNewPage(lineHeight);
        doc.text(line, margin, currentY);
        currentY += lineHeight;
      }
      currentY += sectionSpacing * 2;
    }

    if (data.attachments && data.attachments.length > 0) {
      checkNewPage(20);

      doc.setFont("helvetica", "bold");
      doc.text("Archivos Adjuntos", margin, currentY);
      currentY += lineHeight * 1.5;

      doc.setFont("helvetica", "normal");
      data.attachments.forEach((file) => {
        checkNewPage(lineHeight * 2);

        const fileInfo = `- ${file.type} (${formatFileSize(file.size)})`;
        doc.text(fileInfo, margin, currentY);

        const espacioExtra = 5;
        doc.setTextColor(0, 0, 255);
        doc.textWithLink(
          "Ver Archivo",
          margin + doc.getTextWidth(fileInfo) + espacioExtra,
          currentY,
          {
            url: file.url,
            underline: true,
          }
        );
        doc.setTextColor(0, 0, 0);

        currentY += lineHeight;
      });
      currentY += sectionSpacing;
    }

    checkNewPage(20);
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(
      "Este documento certifica que la solicitud fue enviada.",
      margin,
      currentY
    );
    currentY += lineHeight;

    const currentDate = new Date();
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(
      "Contacto: admin@quejate.com.co | https://quejate.com.co",
      margin,
      currentY
    );
  } catch (error) {
    console.error("Error al generar el certificado:", error);
    throw error;
  }

  return doc.output('blob');
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
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
