import { proxyToBackend } from "@/lib/api/proxy";

/**
 * La valoración que el ciudadano ya dejó a un abogado →
 * `GET /lawyer/rating/my-rating?lawyerId=`.
 *
 * Bloque A (contrato congelado). Sobre `{ rating }`, con `rating: null` si
 * todavía no ha valorado. Exige sesión; 400 sin `lawyerId` y 404 si el abogado
 * no existe.
 *
 * ⚠️ En el backend vive en su propio controlador (`@Controller('lawyer/rating')`)
 * para que `my-rating` no lo atrape el `@Get(':id')` del directorio de
 * abogados. La ruta pública es idéntica.
 */
export async function GET(request: Request) {
  return proxyToBackend(request, "/lawyer/rating/my-rating");
}
