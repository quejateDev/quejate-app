"use server";

import { getUserByEmail } from "@/data/user";
import { getVerificationTokenByToken } from "@/data/verification-token";
import prisma from "@/lib/prisma";

export const newVerification = async (token: string) => {
    const existinToken = await getVerificationTokenByToken(token);
    if (!existinToken) {
        return { 
            error: "Este enlace de verificación ya fue utilizado o no es válido.",
            isUsed: true
        };
    }

    const hasExpired = new Date(existinToken.expires) < new Date();

    if (hasExpired) {
        return { 
            error: "Este enlace de verificación ha expirado. Por favor, solicita un nuevo enlace de verificación desde la página de login.",
            isExpired: true
        };
    }

    const existingUser = await getUserByEmail(existinToken.email);

    if (!existingUser) {
        return { error: "No se pudo encontrar una cuenta asociada a este enlace de verificación." };
    }

    if (existingUser.emailVerified) {
        await prisma.verificationToken.delete({
            where: { id: existinToken.id }
        });
        return { 
            success: "Tu cuenta ya ha sido verificada exitosamente. Puedes proceder a iniciar sesión.",
            alreadyVerified: true
        };
    }

    await prisma.user.update({
        where: { id: existingUser.id },
        data: { 
            emailVerified: new Date(),
            email: existinToken.email,
        }
    });

    await prisma.verificationToken.delete({
        where: { id: existinToken.id }
    });

    return { success: "Correo verificado exitosamente." }; 
}