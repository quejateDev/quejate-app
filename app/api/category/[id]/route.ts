import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: any
) {
  try {
    const { id } = await params
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        entities: true,
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      { error: "Error fetching category" },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// Las operaciones de ESCRITURA de esta ruta se retiraron el 02/09/2026.
//
// No tenian ninguna comprobacion de sesion: el middleware de la web solo
// protege paginas (`privateRoutes`), y estos manejadores solo importaban
// `prisma`. Cualquiera en internet podia invocarlas.
//
// La administracion de catalogos vive en el panel, y desde la Tarea 15 pasa
// por el backend unificado, donde `EntityScopeGuard` decide quien puede que.
// Esta ruta se queda como lectura publica, que es lo unico que la web usa.
//
// NO reponer estos metodos aqui. Si hiciera falta escribir, es en el backend.
// ---------------------------------------------------------------------------
