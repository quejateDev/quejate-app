
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function getUserIdFromToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("token");

  if (!tokenCookie?.value) return null;

  try {
    const decoded = jwt.verify(tokenCookie.value, process.env.JWT_SECRET!) as { id: string };
    return decoded.id;
  } catch (error) {
    console.error("Error al verificar el token:", error);
    return null;
  }
}
