import PqrCreationEmail from "@/emails/pqr-creation";
import VerificationEmail from "@/emails/VerificationEmail";
import ResetPasswordEmail from "@/emails/ResetPasswordEmail";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPQRCreationEmail(
  email: string,
  name: string,
  subject: string,
  pqrNumber: string,
  creationDate: string,
  pqrLink: string
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
    }),
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function sendVerificationEmail(email: string, token: string) {
  const { data, error } = await resend.emails.send({
    from: "noresponder@quejate.com.co",
    to: [email],
    subject: "Verifique su correo electr&oacute;nico",
    react: VerificationEmail({ userName: email, token: token }),
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const { data, error } = await resend.emails.send({
    from: "noresponder@quejate.com.co",
    to: [email],
    subject: "Restablece tu contraseña - Quejate",
    react: ResetPasswordEmail({ userName: email, token: token }),
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}