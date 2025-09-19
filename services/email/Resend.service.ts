import PqrCreationEmail from "@/emails/templates/pqr-creation";
import OversightCreationEmail from "@/emails/templates/oversight-control-creation";
import { Resend } from "resend";
import OversightNotificationEmail from "@/emails/templates/oversight-notification";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPQRCreationEmail(
  email: string,
  name: string,
  subject: string,
  pqrNumber: string,
  creationDate: string,
  pqrLink: string,
  entityName: string,
  entityEmail?: string
) {
  const { data, error } = await resend.emails.send({
    from: "noresponder@quejate.com.co",
    to: [email],
    subject: subject,
    react: PqrCreationEmail({
      userName: name,
      pqrNumber: pqrNumber,
      creationDate: creationDate,
      pqrLink: pqrLink,
      entityName: entityName,
      entityEmail: entityEmail,
    }),
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function sendOversightDocumentEmail(
  oversightEmail: string,
  oversightName: string,
  entityName: string,
  creatorInfo: {
    name: string;
    email: string;
    phone?: string;
  },
  pqrUrl: string,
  documentUrl: string
) {
  try {
    const response = await fetch(documentUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch document: ${response.statusText}`);
    }
    
    const pdfBuffer = await response.arrayBuffer();
    const pdfBase64 = Buffer.from(pdfBuffer).toString('base64');

    const { data, error } = await resend.emails.send({
      from: "noresponder@quejate.com.co",
      to: [oversightEmail],
      subject: `Documento de Supervisión - ${entityName}`,
      react: OversightNotificationEmail({
        oversightName,
        entityName,
        creatorInfo,
        pqrUrl,
        documentUrl,
      }),
      attachments: [
        {
          filename: `reporte_ente_control_${entityName}.pdf`,
          content: pdfBase64,
          contentType: 'application/pdf',
        },
      ],
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Error sending oversight document email:', error);
    throw error;
  }
}

export async function sendOversightCreationConfirmationEmail(
  userEmail: string,
  userName: string,
  pqrUrl: string
) {
  const creationDate = new Date().toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const { data, error } = await resend.emails.send({
    from: "noresponder@quejate.com.co",
    to: [userEmail],
    subject: "Confirmación de Solicitud de Supervisión - Quejate",
    react: OversightCreationEmail({
      userName,
      creationDate,
      pqrLink: pqrUrl,
    }),
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}