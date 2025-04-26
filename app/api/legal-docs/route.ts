//api/legal-docs/route.ts
import { NextRequest, NextResponse } from "next/server";
import { generateTutelaPrompt } from "@/lib/gpt/generateTutelaPrompt";
import { sendToGPT } from "@/lib/gpt/sendToModel";

export async function POST(req: NextRequest) {
  try {
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
