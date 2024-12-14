import PqrCreationEmail from "@/components/emails/pqr-creation";
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
  console.log("Sending email to:", email);
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

  console.log("Email sent:", data);
  console.log("Error:", error);

  return email;
}
