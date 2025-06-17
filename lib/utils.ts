import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { SignJWT, jwtVerify } from "jose";
import { JWT_SECRET } from "./config";
const { cookies } = await import("next/headers");

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export async function signToken({
  id,
  role,
  email,
  entityId,
}: {
  id: string;
  role: string;
  email: string;
  entityId: string;
}) {
  const secret = new TextEncoder().encode(JWT_SECRET);
  return new SignJWT({ id, role, email, entityId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

interface JWTPayload {
  id: string;
  role: string;
  email: string;
  entityId: string;
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return {
      id: payload.id as string,
      role: payload.role as string,
      email: payload.email as string,
      entityId: payload.entityId as string,
    };
  } catch (error) {
    console.error("Token verification error:", error);
    return null;
  }
}

export async function getCookie(cookieName: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get(cookieName);
  return token?.value;
}
