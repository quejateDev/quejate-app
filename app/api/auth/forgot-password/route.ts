import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { ForgotPasswordSchema } from "@/schemas";
import { sendPasswordResetCodeEmail } from "@/emails/mail";

const CODE_EXPIRATION_MINUTES = 15;
const MAX_REQUESTS_PER_HOUR = 3;
const SUCCESS_RESPONSE = { success: true } as const;

const generateSixDigitCode = () => {
  const n = Math.floor(Math.random() * 1_000_000);
  return n.toString().padStart(6, "0");
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = ForgotPasswordSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "INVALID_EMAIL", message: "El correo electrónico no es válido" },
        { status: 400 }
      );
    }

    const { email } = validated.data;

    const user = await prisma.user.findFirst({
      where: { email: { equals: email, mode: "insensitive" } },
      select: { id: true, name: true, email: true },
    });

    if (!user || !user.email) {
      return NextResponse.json(SUCCESS_RESPONSE, { status: 200 });
    }

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentRequests = await prisma.passwordResetCode.count({
      where: {
        userId: user.id,
        createdAt: { gte: oneHourAgo },
      },
    });

    if (recentRequests >= MAX_REQUESTS_PER_HOUR) {
      console.warn(`[FORGOT_PASSWORD_RATE_LIMIT] userId=${user.id} requests=${recentRequests}`);
      return NextResponse.json(SUCCESS_RESPONSE, { status: 200 });
    }

    await prisma.passwordResetCode.updateMany({
      where: { userId: user.id, consumed: false },
      data: { consumed: true },
    });

    const code = generateSixDigitCode();
    const codeHash = await bcrypt.hash(code, 10);
    const expiresAt = new Date(Date.now() + CODE_EXPIRATION_MINUTES * 60 * 1000);

    await prisma.passwordResetCode.create({
      data: {
        userId: user.id,
        codeHash,
        expiresAt,
      },
    });

    await sendPasswordResetCodeEmail(user.email, code, user.name ?? undefined);

    return NextResponse.json(SUCCESS_RESPONSE, { status: 200 });
  } catch (error) {
    console.error("[FORGOT_PASSWORD_ERROR]", error);
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
