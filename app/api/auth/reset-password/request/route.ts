import { NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import prisma from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/services/email/Resend.service";

const requestSchema = z.object({
  email: z.string().email(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = requestSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Si la cuenta existe, se ha enviado un enlace de restablecimiento" },
        { status: 200 }
      );
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    await prisma.user.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    await sendPasswordResetEmail(email, resetToken).catch((error) => console.error(error)); 

    return NextResponse.json(
      { message: "Si la cuenta existe, se ha enviado un enlace de restablecimiento" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al solicitar restablecimiento de contraseña:", error);
    return NextResponse.json(
      { message: "Ocurrió un error al procesar la solicitud" },
      { status: 500 }
    );
  }
}
