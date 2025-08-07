import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
    const confirmLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/new-verification?token=${token}`;
    await resend.emails.send({
        from: process.env.EMAIL_FROM || "noresponder@quejate.com.co",
        to: email,
        subject: "Verifica tu correo electrónico",
        html: `
            <p>Hola,</p>
            <p>Por favor, verifica tu correo electrónico haciendo clic en el siguiente enlace:</p>
            <a href="${confirmLink}">Verificar correo electrónico</a>
            <p>Si no solicitaste esta verificación, ignora este mensaje.</p>
            <p>Gracias,</p>
            <p>El equipo de Quejate</p>
        `,
    })
}
