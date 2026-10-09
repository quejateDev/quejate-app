import { PQR } from "@/types/pqrsd";

/**
 * Si a su dueño se le enseña una PQRSD como vencida. De aquí salen el aviso de
 * `PQRCardHeader` y el borde rojo de `PQRCard`, para que no puedan decir cosas
 * distintas.
 *
 * Si está vencida lo decide el servidor (`isOverdue`), como en la app móvil.
 * Del aviso sale la tutela, así que aquí la condición solo se estrecha, nunca
 * se amplía:
 * - por el tipo, porque una sugerencia no tiene plazo legal y no puede acabar
 *   en una tutela aunque un dato llegara mal;
 * - por el estado, porque «Ya recibí respuesta» lo cambia en la pantalla sin
 *   volver a pedir la PQRSD, y el `isOverdue` que llegó con la lista seguiría
 *   en `true` hasta recargar.
 */
export function isOverdueForOwner(pqr: PQR, isUserProfile: boolean): boolean {
  return (
    isUserProfile &&
    pqr.isOverdue === true &&
    pqr.type !== "SUGGESTION" &&
    pqr.status !== "RESOLVED" &&
    pqr.status !== "CLOSED"
  );
}
