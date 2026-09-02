import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import geoData from "@/data/colombia-geo.json";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const departmentId = searchParams.get("departmentId");
    const municipalityId = searchParams.get("municipalityId");
    const categoryId = searchParams.get("categoryId");

    let whereClause: Record<string, unknown> = {};

    if (municipalityId) {
      whereClause = { municipalityId };
    } else if (departmentId) {
      whereClause = { regionalDepartmentId: departmentId };
    }

    if (categoryId) {
      whereClause = { ...whereClause, categoryId };
    }

    const entities = await prisma.entity.findMany({
      where: {
        ...whereClause,
        isActive: true,
        category: {
          isActive: true,
        },
      },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        description: true,
        imageUrl: true,
        email: true,
        createdAt: true,
        municipalityId: true,
        regionalDepartmentId: true,
        category: { select: { id: true, name: true } },
        _count: { select: { pqrs: true } }
      },
    });

    const departmentMap = new Map<string, string>();
    const municipalityMap = new Map<string, {name: string, departmentId: string}>();

    geoData.departments.forEach(dept => {
      departmentMap.set(dept.id, dept.name);
      dept.municipalities.forEach(mun => {
        municipalityMap.set(mun.id, {name: mun.name, departmentId: dept.id});
      });
    });

    const enrichedEntities = entities.map(entity => {
      const municipalityInfo = entity.municipalityId ? municipalityMap.get(entity.municipalityId) : null;
      const departmentName = entity.regionalDepartmentId 
        ? departmentMap.get(entity.regionalDepartmentId) 
        : (municipalityInfo ? departmentMap.get(municipalityInfo.departmentId) : null);

      return {
        ...entity,
        municipality: municipalityInfo?.name || null,
        department: departmentName || null
      };
    });

    return NextResponse.json(enrichedEntities);
  } catch (error) {
    console.error("Error fetching entities:", error);
    return NextResponse.json(
      { error: "Error fetching entities" },
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
