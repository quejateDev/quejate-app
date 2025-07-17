import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const documentData = await request.json();
    
    const apiUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL;
    if (!apiUrl) {
      return NextResponse.json(
        { error: "URL de API no configurada" },
        { status: 500 }
      );
    }

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(documentData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error from AWS API Gateway:", errorText);
      return NextResponse.json(
        { error: "Error al generar el documento de tutela" },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    return NextResponse.json({ tutela: data.tutela });
  } catch (error) {
    console.error("Error in tutela API:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
