import { NextResponse } from "next/server";
import { proxyToBackend } from "@/lib/api/proxy";
import { ENTITY_LINK_HEADERS, isBase64UrlToken } from "@/lib/entity-link";

/**
 * La entidad confirma que recibió la PQRSD, desde su enlace →
 * `POST /entity-links/:token/confirmation` del backend (R-42). Solo la usa la
 * página `app/entidad/[token]`; la móvil no la conoce.
 *
 * 🔴 **Sin sesión, a propósito**: la credencial es el token de la ruta, que
 * solo viaja en el correo a la entidad. El backend responde 200 con
 * `{ confirmedAt, radicado }`, 400 con `{ error, details }` si el radicado no
 * vale, 404 si el token no existe y 429 pasadas 30 peticiones por IP y minuto.
 * Esa IP es la del funcionario porque `proxyToBackend` la reenvía firmada
 * (R-36); sin eso, todas las entidades compartirían el mismo cupo.
 *
 * Todas las respuestas llevan las cabeceras de la página
 * ({@link ENTITY_LINK_HEADERS}), también los errores. Nada de aquí escribe el
 * token en el registro.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;

  let response: NextResponse;
  if (!isBase64UrlToken(token)) {
    // El mismo 404 que da el backend a un token mal formado.
    response = NextResponse.json(
      { error: "Enlace no encontrado" },
      { status: 404 },
    );
  } else {
    try {
      response = await proxyToBackend(
        request,
        `/entity-links/${encodeURIComponent(token)}/confirmation`,
        { searchParams: "drop" },
      );
    } catch {
      // Sin el error: no lleva la dirección, pero así no hay que comprobarlo.
      console.error("[entidad] el backend no respondió a la confirmación");
      response = NextResponse.json(
        { error: "No se pudo guardar la confirmación" },
        { status: 502 },
      );
    }
  }

  for (const [name, value] of Object.entries(ENTITY_LINK_HEADERS)) {
    response.headers.set(name, value);
  }
  return response;
}
