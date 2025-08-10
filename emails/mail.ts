import { Resend } from "resend";
import { VerificationEmail } from "./templates/VerificationEmail";
import { ResetPasswordEmail } from "./templates/ResetPasswordEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string, userName?: string) => {
    await resend.emails.send({
        from: process.env.EMAIL_FROM || "noresponder@quejate.com.co",
        to: email,
        subject: "Verifica tu correo electrónico - Quejate",
        react: VerificationEmail({ 
            userName: userName || "Usuario", 
            token 
        }),
    });
}

export const sendPasswordResetEmail = async (email: string, token: string, userName?: string) => {
    await resend.emails.send({
        from: process.env.EMAIL_FROM || "noresponder@quejate.com.co",
        to: email,
        subject: "Restablece tu contraseña - Quejate",
        react: ResetPasswordEmail({ 
            userName: userName || "Usuario", 
            token 
        }),
    });
}