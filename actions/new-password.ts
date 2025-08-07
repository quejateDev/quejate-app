"use server";

import { getPasswordResetTokenByToken } from "@/data/password-reset-token";
import { getUserByEmail } from "@/data/user";
import { NewPasswordSchema } from "@/schemas";
import * as z from "zod";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export const newPassword = async (values: z.infer<typeof NewPasswordSchema>, token?: string | null) => {

    if (!token) {
        return { error: "Token inválido" };
    }

    const validatedFields = NewPasswordSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Campos inválido" };
    }

    const { password} = validatedFields.data;

    const existingToken = await getPasswordResetTokenByToken(token);

    if (!existingToken) {
        return { error: "Token no encontrado" };
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
        return { error: "Token expirado" };
    }

    const existingUser = await getUserByEmail(existingToken.email);

    if (!existingUser) {
        return { error: "Usuario no encontrado" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
        where: { id: existingUser.id },
        data: { password: hashedPassword },
    });

    await prisma.passwordResetToken.delete({
        where: { id: existingToken.id },
    });

    return { success: "Contraseña restablecida con éxito" };
}