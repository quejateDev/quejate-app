"use server";

import { getUserByEmail } from "@/data/user";
import { getVerificationTokenByToken } from "@/data/verification-token";
import prisma from "@/lib/prisma";

export const newVerification = async (token: string) => {
    const existinToken = await getVerificationTokenByToken(token);
    if (!existinToken) {
        return { error: "Token no existe" };
    }

    const hasExpired = new Date(existinToken.expires) < new Date();

    if (hasExpired) {
        return { error: "Token ha expirado" };
    }

    const existingUser = await getUserByEmail(existinToken.email);

    if (!existingUser) {
        return { error: "Email no encontrado" };
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

    return { success: "Correo verificado exitosamente" }; 
}