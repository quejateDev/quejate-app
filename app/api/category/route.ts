import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: {
        isActive: true,
      },
      include: {
        entities: true,
      },
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Error fetching categories" },
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
