import { NextRequest, NextResponse } from "next/server";
import { encode } from "next-auth/jwt";
import prisma from "@/lib/prisma";
import { getUserByEmail } from "@/data/user";

const ALLOWED_CLIENT_IDS = [
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_ID_IOS,
  process.env.GOOGLE_CLIENT_ID_ANDROID,
].filter(Boolean) as string[];

const COOKIE_NAME =
  process.env.NODE_ENV === "production"
    ? "__Secure-authjs.session-token"
    : "authjs.session-token";

export async function POST(req: NextRequest) {
  try {
    const { idToken } = await req.json();

    if (!idToken || typeof idToken !== "string") {
      return NextResponse.json(
        { error: "idToken requerido" },
        { status: 400 }
      );
    }

    const googleRes = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`
    );
    const payload = await googleRes.json();

    if (payload.error || !payload.sub) {
      return NextResponse.json(
        { error: "Token inválido o expirado" },
        { status: 401 }
      );
    }

    if (payload.email_verified !== "true" && payload.email_verified !== true) {
      return NextResponse.json(
        { error: "El email de Google no está verificado" },
        { status: 401 }
      );
    }

    if (ALLOWED_CLIENT_IDS.length > 0 && !ALLOWED_CLIENT_IDS.includes(payload.aud)) {
      return NextResponse.json(
        { error: "Token no autorizado para esta aplicación" },
        { status: 401 }
      );
    }

    const existingAccount = await prisma.account.findUnique({
      where: {
        provider_providerAccountId: {
          provider: "google",
          providerAccountId: payload.sub,
        },
      },
      include: { user: true },
    });

    let user = existingAccount?.user ?? null;

    if (!user) {
      user = await getUserByEmail(payload.email);

      if (!user) {
        user = await prisma.user.create({
          data: {
            email: payload.email,
            name: payload.name ?? payload.email,
            image: payload.picture ?? null,
            emailVerified: new Date(),
          },
        });
      } else if (!user.emailVerified) {
        await prisma.user.update({
          where: { id: user.id },
          data: { emailVerified: new Date() },
        });
      }

      await prisma.account.create({
        data: {
          userId: user.id,
          type: "oauth",
          provider: "google",
          providerAccountId: payload.sub,
          id_token: idToken,
        },
      });
    }

    if (!user.isActive) {
      return NextResponse.json(
        { error: "Cuenta desactivada" },
        { status: 403 }
      );
    }

    const sessionToken = await encode({
      token: {
        sub: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
        entityId: user.entityId ?? null,
        isOAuth: true,
      },
      secret: process.env.AUTH_SECRET!,
      maxAge: 30 * 24 * 60 * 60,
      salt: COOKIE_NAME,
    });

    return NextResponse.json({
      sessionToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
        entityId: user.entityId ?? null,
        isOAuth: true,
      },
    });
  } catch (error) {
    console.error("[MOBILE_GOOGLE_AUTH_ERROR]", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
