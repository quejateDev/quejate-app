import PqrCreationEmail from "@/emails/pqr-creation";
import VerificationEmail from "@/emails/VerificationEmail";
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
    from: "onboarding@resend.dev",
    to: [email],
    subject: subject,
    react: PqrCreationEmail({
      userName: name,
      pqrNumber: pqrNumber,
      creationDate: creationDate,
      pqrLink: pqrLink,
    }),
  });

  return email;
}

export async function sendVerificationEmail(email: string, token: string) {
  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: ["luisevilla588@gmail.com"],
    subject: "Verifique su correo electr&oacute;nico",
    react: VerificationEmail({ userName: email, token: token }),
  });

  console.log(data);
  console.log(error);
  return data;
}
