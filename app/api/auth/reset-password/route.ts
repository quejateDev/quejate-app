import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { ResetPasswordCodeSchema } from "@/schemas";

const MAX_ATTEMPTS_PER_CODE = 5;

const invalidCodeResponse = () =>
  NextResponse.json(
    { error: "INVALID_CODE", message: "El código es incorrecto o expiró" },
    { status: 400 }
  );

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = ResetPasswordCodeSchema.safeParse(body);

    if (!validated.success) {
      const fieldErrors = validated.error.flatten().fieldErrors;
      if (fieldErrors.newPassword) {
        return NextResponse.json(
          { error: "WEAK_PASSWORD", message: "La contraseña debe tener al menos 6 caracteres" },
          { status: 400 }
        );
      }
      return invalidCodeResponse();
    }

    const { email, code, newPassword } = validated.data;

    const user = await prisma.user.findFirst({
      where: { email: { equals: email, mode: "insensitive" } },
      select: { id: true },
    });

    if (!user) {
      return invalidCodeResponse();
    }

    const resetCode = await prisma.passwordResetCode.findFirst({
      where: {
        userId: user.id,
        consumed: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!resetCode) {
      console.warn(`[RESET_PASSWORD_NO_ACTIVE_CODE] userId=${user.id}`);
      return invalidCodeResponse();
    }

    const nextAttempts = resetCode.attempts + 1;

    if (nextAttempts > MAX_ATTEMPTS_PER_CODE) {
      await prisma.passwordResetCode.update({
        where: { id: resetCode.id },
        data: { consumed: true, attempts: nextAttempts },
      });
      console.warn(`[RESET_PASSWORD_MAX_ATTEMPTS] userId=${user.id} codeId=${resetCode.id}`);
      return invalidCodeResponse();
    }

    const codeMatches = await bcrypt.compare(code, resetCode.codeHash);

    if (!codeMatches) {
      await prisma.passwordResetCode.update({
        where: { id: resetCode.id },
        data: { attempts: nextAttempts },
      });
      console.warn(`[RESET_PASSWORD_BAD_CODE] userId=${user.id} attempts=${nextAttempts}`);
      return invalidCodeResponse();
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      }),
      prisma.passwordResetCode.update({
        where: { id: resetCode.id },
        data: { consumed: true, attempts: nextAttempts },
      }),
    ]);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[RESET_PASSWORD_ERROR]", error);
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
