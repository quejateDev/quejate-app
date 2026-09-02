import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request, { params }: any) {
  try {
    const { id } = await params;
    const entity = await prisma.entity.findUnique({
      where: { 
        id,
        category: {
          isActive: true,
        },
        isActive: true
      },
      include: {
        category: true,
        pqrConfig: {
          include: {
            customFields: true,
          },
        },
        RegionalDepartment: true,
        Municipality: true,
      },
    });

    if (!entity) {
      return new NextResponse("Entity not found", { status: 404 });
    }

    return NextResponse.json(entity);
  } catch (error) {
    console.error("[ENTITY_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
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
