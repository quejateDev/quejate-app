import { OversightSendResult } from "../services/pqrFollowUpService";

/** Lo que la pantalla le dice al ciudadano sobre un envío del oficio. */
export type OversightSendNotice = {
  tone: "success" | "warning" | "error";
  title: string;
  description: string;
};

/** El ente de control al que se envió, o se intentó enviar, el oficio. */
type NoticeTarget = { name: string; phone?: string | null };

/**
 * Título y texto del aviso de un envío, en lenguaje llano.
 *
 * Todos dicen **si el oficio salió**, porque es lo único que el ciudadano
 * necesita para decidir si lo vuelve a enviar: los que no salieron lo dicen
 * («no enviamos nada»), y los que salieron o pueden haber salido le piden que
 * no lo reenvíe, porque el ente lo recibiría dos veces.
 */
export function describeOversightSend(
  result: OversightSendResult,
  target: NoticeTarget
): OversightSendNotice {
  const { name } = target;

  switch (result.kind) {
    case "sent":
      return result.citizenNotified
        ? {
            tone: "success",
            title: "Oficio enviado",
            description: `Enviamos el oficio a ${name}. También te mandamos una confirmación a tu correo.`,
          }
        : {
            // El oficio salió y solo falló el aviso al ciudadano. Quien no
            // recibe la confirmación tiende a creer que no se envió y a
            // repetir: por eso se le dice que no lo haga.
            tone: "success",
            title: "Oficio enviado",
            description: `Enviamos el oficio a ${name}, pero no pudimos mandarte la confirmación a tu correo. El envío sí se hizo: no lo vuelvas a enviar, o ${name} lo recibiría dos veces.`,
          };

    case "unconfirmed": {
      // No se remite al correo del ciudadano: en el 504 el backend no llega a
      // mandarle la confirmación, así que que no le llegue no demuestra nada,
      // y es justo la conclusión que acaba en un reenvío. Solo el ente sabe.
      const contact = target.phone ? `${name} al ${target.phone}` : name;
      return {
        tone: "warning",
        title: "No sabemos si el oficio llegó",
        description:
          `No pudimos confirmar si el oficio le llegó a ${name}, y es posible que sí. ` +
          "No lo vuelvas a enviar sin comprobarlo: si ya le llegó, lo recibiría dos veces. " +
          `Para comprobarlo, comunícate con ${contact}.`,
      };
    }

    case "rate-limited":
      return {
        tone: "warning",
        title: "Espera antes de volver a intentarlo",
        description:
          "Hay un límite de envíos por hora y ya lo alcanzaste. " +
          `Podrás volver a intentarlo ${waitTime(result.retryAfterSeconds)}. ` +
          "No enviamos nada en este intento.",
      };

    case "no-mailbox":
      return {
        tone: "warning",
        title: "No podemos enviárselo por correo",
        description: `${name} no tiene un correo registrado en nuestro directorio, así que no podemos enviarle el oficio. No enviamos nada. Puedes descargar el PDF y presentarlo directamente ante ${name}.`,
      };

    case "not-found":
      // El backend responde 404 a varias cosas sin decir cuál, a propósito
      // (un 403 confirmaría que el recurso existe): el oficio caducó o no es
      // de quien lo envía, la PQRSD no es suya, el ente no es competente para
      // ella, o la cuenta no tiene correo. El aviso nombra las que el
      // ciudadano puede entender, y en todas la salida es la misma.
      return {
        tone: "error",
        title: "No se pudo enviar",
        description: `El oficio o la PQRSD ya no están disponibles, o ${name} no corresponde a la ubicación de la entidad de esta PQRSD. No enviamos nada. Cierra esta ventana y vuelve a empezar el seguimiento.`,
      };

    case "session-expired":
      return {
        tone: "error",
        title: "Sesión caducada",
        description: "Vuelve a iniciar sesión e inténtalo de nuevo. No enviamos nada.",
      };

    case "not-sent":
      return {
        tone: "error",
        title: "No se pudo enviar el oficio",
        description: `No enviamos nada. Inténtalo de nuevo en unos minutos; si sigue fallando, descarga el PDF y preséntalo directamente ante ${name}.`,
      };
  }
}

/**
 * ¿Se puede volver a pulsar «Enviar» después de este resultado?
 *
 * No, cuando repetir haría daño o no serviría: tras `sent` duplicaría el
 * oficio en el buzón del ente; tras `unconfirmed` podría duplicarlo, y el
 * reenvío queda detrás de una acción que dice que se comprobó; y tras
 * `no-mailbox` o `not-found` el backend daría la misma respuesta.
 */
export function allowsAnotherSend(result: OversightSendResult | null): boolean {
  if (!result) return true;

  switch (result.kind) {
    case "rate-limited":
    case "session-expired":
    case "not-sent":
      return true;
    default:
      return false;
  }
}

/** «en 12 minutos», con el plazo del backend si llegó. */
function waitTime(seconds: number | null): string {
  if (seconds === null) {
    // El límite es por hora: más de eso no hay que esperar.
    return "dentro de una hora como máximo";
  }

  const minutes = Math.ceil(seconds / 60);
  if (minutes >= 60) return "en una hora";
  return minutes === 1 ? "en 1 minuto" : `en ${minutes} minutos`;
}
