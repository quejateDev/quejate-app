"use server";

import { getUserByEmail } from "@/data/user";
import { getPasswordResetTokenByEmail } from "@/data/password-reset-token";
import { sendPasswordResetEmail } from "@/emails/mail";
import { generatePasswordResetToken } from "@/lib/tokens";
import { ResetSchema } from "@/schemas";
import * as z from "zod";

/**
 * Solicitud de restablecimiento de contraseña de la web (**H-23**).
 *
 * ## Qué estaba mal
 *
 * Esta acción respondía **«Correo no encontrado»** cuando la cuenta no existía.
 * Eso convierte el formulario en un **oráculo de enumeración**: cualquiera, sin
 * sesión, podía probar direcciones y quedarse con las que están registradas —
 * el primer paso de un ataque de credenciales, y de por sí una fuga de datos
 * personales. Y no tenía **ningún** freno, así que probar se podía hacer en
 * bucle.
 *
 * La misma plataforma ya lo hacía bien por el otro lado: el backend responde
 * `{ success: true }` exista o no la cuenta, y lo tiene documentado como
 * decisión anti-enumeración (`password-reset.service.ts`). Una puerta se cuidó
 * y la otra no.
 *
 * ## Por qué NO se repunta al backend, que es lo que proponía la ficha
 *
 * Porque **no son el mismo flujo**. El backend restablece con un **código de
 * seis dígitos** que se canjea en una sola llamada, sobre la tabla
 * `PasswordResetCode`; esta web manda un **enlace con un token**, sobre
 * `PasswordResetToken`, que se canjea en la página `/auth/new-password`.
 * Apuntar esta acción al backend no sería repuntar: sería cambiarle a quien usa
 * la web la pantalla de «pincha el enlace» por «escribe el código», y rehacer
 * la página de canje. Eso es una funcionalidad nueva, no el cierre de un
 * hallazgo, y merece decidirse aparte.
 *
 * Lo que sí se cierra aquí es lo explotable: el oráculo, entero, y el abuso por
 * repetición.
 *
 * ## La respuesta es siempre la misma
 *
 * Exista la cuenta o no, se responda o no un correo, esta acción devuelve el
 * **mismo** `success`. Es la única forma de que no se pueda distinguir, y por
 * eso el mensaje habla en condicional: no se le puede prometer a alguien que
 * hay un correo en camino sin decirle de paso si esa cuenta existe.
 *
 * ⚠️ **Queda un canal de tiempo**, y se declara en vez de esconderlo: cuando la
 * cuenta existe hay que escribir un token y enviar un correo, y eso tarda más
 * que no hacer nada. Medir esa diferencia es mucho más caro y ruidoso que leer
 * un mensaje, pero no es cero. El backend tiene exactamente la misma propiedad
 * y la aceptó por lo mismo.
 */

/**
 * Espera mínima entre dos solicitudes para el mismo correo.
 *
 * 🔑 **Se deduce del token que ya existe, sin tocar el esquema.**
 * `generatePasswordResetToken` fija `expires` a una hora exacta desde su
 * creación y **borra el anterior**, así que solo hay una fila por correo y su
 * momento de creación es `expires - 1 hora`. No hace falta una columna nueva —
 * y no podría añadirse: el esquema lo gobierna `quejate-backend`.
 *
 * Dos minutos es el equilibrio: corta el envío masivo a un buzón ajeno y el uso
 * de esta puerta como relé de correo, sin castigar a quien no vio el primero y
 * vuelve a pedirlo. Un freno más duro aquí se convertiría en un problema de
 * soporte, que es como acaban desactivándose.
 */
const MIN_INTERVAL_MS = 2 * 60 * 1000;

/** Vida del token que fija `generatePasswordResetToken`. */
const TOKEN_TTL_MS = 3600 * 1000;

/**
 * El mismo texto en los cuatro caminos: cuenta inexistente, cuenta existente,
 * solicitud repetida demasiado pronto y envío realizado. Si alguno dijera algo
 * distinto, volvería a haber oráculo.
 */
const SAME_ANSWER: ResetResult = {
    success: "Si existe una cuenta con ese correo, recibirás un enlace para restablecer tu contraseña.",
};

/**
 * Lo que el formulario espera. Se declara explícito para que los cuatro
 * caminos devuelvan **el mismo tipo**: si TypeScript infiriera una unión, el
 * propio tipo distinguiría entre ellos y sería otra forma del mismo problema.
 */
type ResetResult = { error?: string; success?: string };

export const reset = async (
    values: z.infer<typeof ResetSchema>,
): Promise<ResetResult> => {
    const validatedFields = ResetSchema.safeParse(values);

    // El único error que sí se distingue, y no filtra nada: dice que lo escrito
    // no tiene forma de correo, no si ese correo está registrado.
    if (!validatedFields.success) {
        return { error: "Correo inválido" };
    }

    const { email } = validatedFields.data;

    const existingUser = await getUserByEmail(email);

    if (!existingUser) {
        return SAME_ANSWER;
    }

    // Freno por correo. Va después de comprobar la cuenta a propósito: si fuera
    // antes, el tiempo de respuesta separaría «hay token reciente» de «no lo
    // hay», y eso también es información sobre la cuenta.
    const existingToken = await getPasswordResetTokenByEmail(email);

    if (existingToken) {
        const createdAt = existingToken.expires.getTime() - TOKEN_TTL_MS;
        if (Date.now() - createdAt < MIN_INTERVAL_MS) {
            return SAME_ANSWER;
        }
    }

    const passwordResetToken = await generatePasswordResetToken(email);

    await sendPasswordResetEmail(
        passwordResetToken.email,
        passwordResetToken.token
    );

    return SAME_ANSWER;
}
