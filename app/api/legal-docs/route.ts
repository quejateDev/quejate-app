import { NextRequest, NextResponse } from "next/server";
import { generateTutelaPrompt } from "@/lib/gpt/generateTutelaPrompt";
import { sendToGPT } from "@/lib/gpt/sendToModel";
import { currentUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    // H-19: esta ruta llama a gpt-4o-mini (`lib/gpt/sendToModel.ts:11`), o sea
    // que cada peticion la paga Quejate. Sin esta comprobacion era un endpoint
    // FACTURADO abierto a internet: cualquiera podia hacernos gastar en bucle
    // (OWASP API4). No hay ningun control de tasa en toda la web, asi que la
    // sesion es lo unico que hay entre esta ruta y la factura de OpenAI.
    //
    // No rompe a ningun cliente, verificado uno a uno:
    //   - `currentUser()` lee la cookie y, si no hay, cae al header
    //     `Authorization: Bearer` (`lib/auth.ts:14-37`).
    //   - La movil adjunta ese Bearer en TODAS sus peticiones, por el
    //     interceptor de `src/core/api/client.ts:29-38`, y esta ruta va por
    //     `apiClient` (`useLegalDocs.ts:33`).
    //   - La unica puerta a esa pantalla exige ademas ya estar autenticado Y
    //     ser el autor de la PQRSD: el modal de vencimiento solo se abre si
    //     `isOwnerNow` (`DetailHeader.tsx:77-81`), y de ahi sale la navegacion
    //     a `FormalFollowup` y luego a `GenerateTutela`
    //     (`FormalFollowupScreen.tsx:27`). Quien llega aqui tiene sesion.
    //   - La web NO usa esta ruta: su generador de tutelas va contra el
    //     gateway externo (`pqrFollowUpService.ts:25-45`).
    //
    // Es ademas la UNICA ruta de `app/api/` que la Tarea 13 no repunta al
    // backend unificado, asi que este es su sitio permanente y no uno de paso.
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const {
      fullName,
      documentNumber,
      city,
      department,
      rightViolated,
      entity,
      pqrType,
      pqrDate,
      daysExceeded,
      pqrDescription,
    } = body;
    
    if (
      !fullName || !documentNumber || !city || !department || !rightViolated ||
      !entity || !pqrType || !pqrDate || daysExceeded == null || !pqrDescription
    ) {
      return NextResponse.json({ error: "Faltan datos para generar la tutela" }, { status: 400 });
    }

    const prompt = generateTutelaPrompt({
      fullName,
      documentNumber,
      city,
      department,
      rightViolated,
      entity,
      pqrType,
      pqrDate,
      daysExceeded,
      pqrDescription,
    });

    const tutela = await sendToGPT(prompt);

    return NextResponse.json({ tutela });
  } catch (error) {
    console.error("[TUTELA_GENERATE_ERROR]", error);
    return NextResponse.json({ error: "Error generando tutela" }, { status: 500 });
  }
}
