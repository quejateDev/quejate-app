import { auth } from "@/auth";
import { headers } from "next/headers";
import { decode } from "next-auth/jwt";

const COOKIE_NAME =
  process.env.NODE_ENV === "production"
    ? "__Secure-authjs.session-token"
    : "authjs.session-token";

export async function currentUser() {
  const session = await auth();
  if (session?.user) return session.user;

  const headersList = await headers();
  const authHeader = headersList.get("Authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    try {
      const decoded = await decode({
        token,
        secret: process.env.AUTH_SECRET!,
        salt: COOKIE_NAME,
      });
      if (decoded?.sub) {
        return {
          id: decoded.sub,
          name: decoded.name as string,
          email: decoded.email as string,
          image: decoded.picture as string,
          role: decoded.role as string,
        };
      }
    } catch {
      return null;
    }
  }
  return null;
}

export async function currentRole() {
  const user = await currentUser();
  return user?.role;
}
