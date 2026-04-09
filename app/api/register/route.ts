import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { RegisterSchema } from "@/schemas";
import prisma from "@/lib/prisma";
import { getUserByEmail } from "@/data/user";
import { sendVerificationEmail } from "@/emails/mail";
import { generateVerificationToken } from "@/lib/tokens";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = RegisterSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Campos inválidos", details: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { email, password, name } = validated.data;

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: "Correo en uso" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: { email, password: hashedPassword, name },
    });

    const verificationToken = await generateVerificationToken(email);
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token,
      name
    );

    return NextResponse.json(
      { success: "Se ha enviado un correo de verificación" },
      { status: 201 }
    );
  } catch (error) {
    console.error("[REGISTER_ERROR]", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
