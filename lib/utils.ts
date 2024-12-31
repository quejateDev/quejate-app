import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string) {
  const parsedDate = new Date(date);

  if (isNaN(parsedDate.getTime())) {
    return date;
  }
  return new Intl.DateTimeFormat("es-ES", {
    month: "short",
    day: "numeric",
  }).format(parsedDate);
}

export function signToken(id: string, role: string) {
  return jwt.sign({ id, role }, JWT_SECRET, { expiresIn: "7d" });
}


//** verify user token and return the id
/*
 * 
 * @param req 
 * @returns 
 */
export function verifyToken(req: Request): null | { id: string; role: string } {
  const token = req.headers.get("Authorization");

  if (!token) {
    return null;
  }

  // get token from bearer
  const bearerToken = token.split(" ")[1];
  if (!bearerToken) {
    return null;
  }
  
  try {
    const decodedToken = jwt.verify(bearerToken, JWT_SECRET);
    return decodedToken as { id: string; role: string };
  } catch (error) {
    console.error("Error verifying token:", error);
    return null;
  }
}
