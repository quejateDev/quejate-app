import prisma from "@/lib/prisma";

export const getPasswordResetTokenByToken = async (token: string) => {
    try {
        const passwordResetToken = await prisma.passwordResetToken.findUnique({
            where: {
                token: token,
            },
        });
        return passwordResetToken;
    } catch {
        return null;
    }
}

export const getPasswordResetTokenByEmail = async (email: string) => {
    try {
        const passwordResetToken = await prisma.passwordResetToken.findFirst({
            where: {
                email: email,
            },
        });
        return passwordResetToken;
    } catch {
        return null;
    }
}