import { NextRequest, NextResponse } from "next/server";
import {
  sendOversightDocumentEmail,
  sendOversightCreationConfirmationEmail,
} from "@/services/email/Resend.service";
import prisma from "@/lib/prisma";
import { currentUser } from "@/lib/auth";

/**
 * Envía al ente de control el oficio de seguimiento de una PQRSD vencida.
 *
 * 🔴 **H-20.** Esta ruta era un SSRF y un relé de correo abierto. Todo lo que
 * decidía a quién se escribe, qué se descarga y qué dice el correo salía del
 * **cuerpo de la petición**: `oversightEntity.email` iba directo a `to:` y
 * `documentUrl` directo a `fetch()`. Con una cuenta —y el registro es
 * abierto— se podía hacer que el servidor descargara cualquier URL, incluidas
 * direcciones internas, y mandar ese fichero como adjunto **desde el dominio
 * de Quéjate** a la dirección que se quisiera.
 *
 * La regla ahora es una sola: **del cuerpo solo se aceptan identificadores.**
 * El destinatario, el nombre de la entidad, los datos del ciudadano y el
 * enlace se leen de la base; del documento solo se acepta una URL que esté en
 * nuestra propia bucket y bajo el prefijo de esta funcionalidad.
 *
 * ⚠️ **Lo que esto todavía no arregla.** Los objetos de `oversight-documents/`
 * son públicos, así que quien conozca la URL de un oficio ajeno puede pedir
 * que se envíe. Cerrarlo del todo exige que el servidor **genere** el
 * documento en vez de recibir su dirección, y eso es el contrato nuevo que la
 * ficha de H-20 propone como tarea aparte. Esta corrección cierra el SSRF y el
 * relé, que es lo explotable hoy contra terceros.
 */

/** Bucket propia. El mismo valor que usa el resto del proyecto. */
const BUCKET = process.env.AWS_BUCKET || "quejate-files";

/** Prefijo donde el cliente sube el oficio (`useS3Upload({ folder })`). */
const DOCUMENT_PREFIX = "/oversight-documents/";

/**
 * ¿Es `value` una URL de un oficio en **nuestra** bucket?
 *
 * Se comprueba el host completo y no un `includes`: `quejate-files.s3.amazonaws.com.atacante.com`
 * contiene el nombre de la bucket y no es nuestra. Y se exige el prefijo de
 * carpeta, para que no valga cualquier objeto del bucket.
 */
function isOwnOversightDocument(value: unknown): value is string {
  if (typeof value !== "string") return false;

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return false;
  }

  if (url.protocol !== "https:") return false;

  const host = url.hostname.toLowerCase();
  const prefix = `${BUCKET.toLowerCase()}.s3.`;
  if (!host.startsWith(prefix)) return false;

  // Lo que sigue es `amazonaws.com` o `<región>.amazonaws.com`; las dos formas
  // las produce `useS3Upload` según haya región configurada o no.
  const rest = host.slice(prefix.length);
  if (rest !== "amazonaws.com" && !/^[a-z0-9-]+\.amazonaws\.com$/.test(rest)) {
    return false;
  }

  return url.pathname.startsWith(DOCUMENT_PREFIX);
}

export async function POST(req: NextRequest) {
  try {
    const caller = await currentUser();

    if (!caller?.id) {
      return NextResponse.json(
        { error: "No autorizado, inicie sesión nuevamente" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const oversightEntityId: unknown = body?.oversightEntity?.id;
    const pqrId: unknown = body?.pqrData?.id;
    const documentUrl: unknown = body?.documentUrl;

    if (typeof oversightEntityId !== "string" || typeof pqrId !== "string") {
      return NextResponse.json(
        { error: "Faltan el ente de control o la PQRSD" },
        { status: 400 }
      );
    }

    if (!isOwnOversightDocument(documentUrl)) {
      // Deliberadamente sin decir por qué: el mensaje no debe servir para
      // averiguar qué direcciones acepta el servidor.
      return NextResponse.json(
        { error: "El documento no es válido" },
        { status: 400 }
      );
    }

    // El ente de control se resuelve por id. Su correo sale de la base: es el
    // cambio que convierte esto de un relé abierto en un envío a un
    // destinatario del directorio de Personerías y Procuradurías.
    const oversightEntity = await prisma.oversightEntity.findUnique({
      where: { id: oversightEntityId },
      select: { name: true, email: true },
    });

    if (!oversightEntity) {
      return NextResponse.json(
        { error: "Ente de control no encontrado" },
        { status: 404 }
      );
    }

    // La PQRSD también, y además se comprueba de quién es: sin esto cualquier
    // cuenta podía elevar a un ente de control la PQRSD de otra persona. Es la
    // misma condición que la interfaz ya aplica —el botón solo aparece en el
    // perfil propio (`PQRCardHeader.tsx:24`)— y que el servidor no tenía.
    const pqr = await prisma.pQRS.findUnique({
      where: { id: pqrId },
      select: { id: true, creatorId: true, entity: { select: { name: true } } },
    });

    if (!pqr || pqr.creatorId !== caller.id) {
      // 404 y no 403, por lo mismo que en las páginas de detalle: un 403
      // confirmaría que esa PQRSD existe a quien no es su autor.
      return NextResponse.json(
        { error: "PQRSD no encontrada" },
        { status: 404 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: caller.id },
      select: { email: true, name: true, phone: true },
    });

    if (!user?.email) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    const userName = `${user.name ?? ""}`.trim() || "Usuario";
    const pqrUrl = `https://quejate.com.co/dashboard/pqr/${pqr.id}`;

    await sendOversightDocumentEmail(
      oversightEntity.email,
      oversightEntity.name,
      pqr.entity?.name || "Entidad",
      {
        name: userName,
        email: user.email,
        // Antes venía en `creatorInfo.phone`, es decir texto libre del cliente
        // dentro de un correo que sale con nuestra marca.
        phone: user.phone ?? "",
      },
      pqrUrl,
      documentUrl
    );

    await sendOversightCreationConfirmationEmail(user.email, userName, pqrUrl);

    return NextResponse.json({
      message:
        "Documento enviado exitosamente al ente de control y confirmación enviada al usuario",
      oversightEntity: oversightEntity.name,
      // `oversightEmail` y `userEmail` ya no se devuelven: eran dos direcciones
      // de correo en una respuesta que solo confirma un envío.
    });
  } catch (error) {
    console.error("Error sending oversight document:", error);
    return NextResponse.json(
      { error: "Error al enviar el documento" },
      { status: 500 }
    );
  }
}
