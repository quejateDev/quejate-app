import { proxyToBackend } from "@/lib/api/proxy";

/**
 * Enviar el oficio al ente de control → `POST /legal-docs/:id/send` del
 * backend (Tarea 29). Solo la usa esta web; la app publicada no la conoce.
 *
 * 🔴 **Cierra el residuo de H-20.** Sustituye a `app/api/oversight/send-document`,
 * que recibía la URL de un PDF que el navegador había subido antes al bucket
 * de S3, a `oversight-documents/`, cuyos objetos son **públicos**: cada oficio
 * enviado —con el nombre del ciudadano, su caso y la entidad denunciada—
 * quedaba legible para quien tuviera el enlace. Aquí no viaja ningún fichero.
 * El cuerpo lleva solo `{ pqrId, oversightEntityId }`, y el backend maqueta el
 * oficio `:id` desde el documento que guardó al generarlo y lo envía adjunto,
 * sin subirlo a ninguna parte.
 *
 * Quién puede enviar qué lo decide el backend, como en el resto de
 * `/legal-docs`: el oficio y la PQRSD tienen que ser de la sesión, y el ente,
 * uno de los competentes para esa PQRSD; el buzón sale de su directorio. Sin
 * sesión, **401**; lo ajeno o lo que no corresponde, **404**. Esta ruta no
 * copia esas reglas: reenvía la identidad y deja pasar el estado.
 *
 * - `forwardRetryAfter`: el límite es de tres envíos por cuenta y hora, y la
 *   pantalla le dice al ciudadano cuánto le falta.
 */

/**
 * Techo de duración de la función en Vercel.
 *
 * El backend habla con Resend dos veces en serie —el oficio y la confirmación
 * al ciudadano—, con un corte de 10 s cada una. Sin declararlo, un proyecto
 * sin *Fluid Compute* corta a los 10 s en el plan Hobby, y un corte aquí es
 * justo el caso malo: el oficio puede haber salido y el ciudadano recibiría un
 * error. 60 s es el máximo de Hobby.
 */
export const maxDuration = 60;

export async function POST(request: Request, { params }: any) {
  const { id } = await params;
  return proxyToBackend(request, `/legal-docs/${encodeURIComponent(id)}/send`, {
    forwardRetryAfter: true,
  });
}
