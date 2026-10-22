import { NextResponse } from "next/server";
import { proxyToBackend } from "@/lib/api/proxy";
import { ENTITY_LINK_HEADERS, isBase64UrlToken } from "@/lib/entity-link";

/**
 * La entidad abrió su enlace en un navegador →
 * `POST /entity-links/:token/opened` del backend (R-42). Solo la usa la
 * página `app/entidad/[token]`, una vez por visita y desde el navegador
 * (`EntityLinkOpenedReport`); la móvil no la conoce.
 *
 * La apertura no la cuenta la lectura de la página porque esa lectura la hace
 * el servidor de la web al pintarla, y los antivirus del correo (los de
 * Microsoft 365, por ejemplo) abren los enlaces solos para revisarlos. La
 * mayoría no ejecuta JavaScript, así que este aviso no les sale.
 *
 * 🔴 **Sin sesión, a propósito**, igual que la confirmación: la credencial es
 * el token de la ruta, que solo viaja en el correo a la entidad. Sin cuerpo.
 * El backend responde 204, 404 si el token no existe y 429 si se pasa del
 * límite por IP. Esa IP es la del funcionario porque `proxyToBackend` la
 * reenvía firmada (R-36).
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
        `/entity-links/${encodeURIComponent(token)}/opened`,
        { searchParams: "drop" },
      );
    } catch {
      // Sin el error: no lleva la dirección, pero así no hay que comprobarlo.
      console.error("[entidad] el backend no respondió al aviso de apertura");
      response = NextResponse.json(
        { error: "No se pudo registrar la apertura" },
        { status: 502 },
      );
    }
  }

  for (const [name, value] of Object.entries(ENTITY_LINK_HEADERS)) {
    response.headers.set(name, value);
  }
  return response;
}
