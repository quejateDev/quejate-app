import { NextRequest, NextResponse } from "next/server";
import { sendToGPT } from "@/lib/gpt/sendToModel";
import { generateOversightPrompt } from "@/lib/gpt/generateOversightPrompt";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      fullName,
      oversightEntity,
      entity,
      pqrType,
      pqrDate,
      daysExceeded,
      pqrDescription,
    } = body;

    if (
      !fullName ||
      !oversightEntity ||
      !entity ||
      !pqrType ||
      !pqrDate ||
      daysExceeded == null ||
      !pqrDescription
    ) {
      return NextResponse.json(
        { error: "Faltan datos para generar el documento de reporte" },
        { status: 400 }
      );
    }

    const prompt = generateOversightPrompt({
      fullName,
      oversightEntity,
      entity,
      pqrType,
      pqrDate,
      daysExceeded,
      pqrDescription,
    });

    const documentText = await sendToGPT(prompt, "Error generando documento de reporte");

    return NextResponse.json({ document: documentText });
  } catch (error) {
    console.error("[OVERSIGHT_REPORT_ERROR]", error);
    return NextResponse.json(
      { error: "Error generando documento de reporte" },
      { status: 500 }
    );
  }
}
