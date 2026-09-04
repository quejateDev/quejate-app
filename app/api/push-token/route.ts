import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { currentUser } from "@/lib/auth";
import { proxyToBackend } from "@/lib/api/proxy";

/**
 * Registrar el token de notificaciones push del teléfono →
 * `POST /push-token`.
 *
 * Bloque A (contrato congelado). Devuelve `{ success: true }`.
 *
 * ⚠️ **`statusMap: { 201: 200 }`.** Nest responde 201 donde Next respondía 200.
 * `usePushNotifications.ts:54` envuelve la llamada en un `try/catch` vacío y no
 * mira el estado, pero se traduce igual, por el mismo criterio que
 * `POST /pqr`: la paridad estricta cuesta una línea.
 */
export async function POST(request: Request) {
  return proxyToBackend(request, "/push-token", { statusMap: { 201: 200 } });
}

// `DELETE /push-token` se retira en el bloque C de esta misma tarea: la móvil
// no da de baja el token al salir y no lo llama nadie más.
export async function DELETE(req: NextRequest) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { pushToken: null },
  });

  return NextResponse.json({ success: true });
}
