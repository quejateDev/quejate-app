import { proxyToBackend } from "@/lib/api/proxy";

/**
 * Directorio de abogados → `GET /lawyer`.
 *
 * Bloque A (contrato congelado). Array pelado con
 * `{ id, userId, specialties, description, feePerHour, feePerService,
 * isVerified, averageRating, ratingCount, user, createdAt }`.
 *
 * 🔴 **Cierra H-10**: el `user` deja de traer `email` y `phone`. Esta ruta no
 * exige sesión, así que servía el correo y el teléfono de **todos** los
 * abogados a cualquiera.
 *
 * ✅ **No rompe a la móvil.** `LawyerCard.tsx:18-52` es la única pantalla que
 * pinta esta lista y lee `user.image`, `user.name`, `isVerified`,
 * `averageRating`, `ratingCount`, `specialties` y `feePerHour`. Comprobado
 * abriendo el fichero, no con un `grep`.
 */
export async function GET(request: Request) {
  return proxyToBackend(request, "/lawyer");
}
