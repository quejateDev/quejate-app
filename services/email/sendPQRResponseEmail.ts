import { Resend } from "resend";
import PqrResponseEmail from "../../emails/templates/pqr-response";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendPQRResponseEmailParams {
  email: string;
  userName: string;
  pqrNumber: string;
  entityName: string;
  responseText: string;
  responseDate: string;
  responderName?: string;
  pqrLink?: string;
}

export async function sendPQRResponseEmail({
  email,
  userName,
  pqrNumber,
  entityName,
  responseText,
  responseDate,
  responderName,
  pqrLink,
}: SendPQRResponseEmailParams) {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "noresponder@quejate.com.co",
      to: email,
      subject: `Respuesta a tu PQRSD ${pqrNumber} - ${entityName}`,
      react: PqrResponseEmail({
        userName,
        pqrNumber,
        entityName,
        responseText,
        responseDate,
        responderName,
        pqrLink,
      }),
    });

    if (error) {
      console.error("Error sending PQR response email:", error);
    }

    return data;
  } catch (error) {
    console.error("Error sending PQR response email:", error);
    throw error;
  }
}
