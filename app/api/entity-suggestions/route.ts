import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import geoData from "@/data/colombia-geo.json";
import { z } from "zod";
import { proxyToBackend } from "@/lib/api/proxy";

const createSuggestionSchema = z.object({
  entityName: z.string().min(1, "Entity name is required"),
  regionalDepartmentId: z.string().min(1, "Regional department is required"),
  municipalityId: z.string().optional(),
});

/**
 * Proponer una entidad que falta en el catálogo → `POST /entity-suggestions`.
 *
 * Bloque B (solo web): el modal «no encuentro mi entidad» del selector,
 * `components/modals/entity-suggestion-modal.tsx:64`. Era otro de los cinco
 * huecos: el backend solo tenía `GET`/`PATCH` bajo `admin/`.
 *
 * Sigue **sin exigir sesión**, y es deliberado: quien no encuentra su entidad
 * puede no tener cuenta todavía, y el modal se abre desde el formulario público
 * de PQRSD. Misma respuesta —la sugerencia con `departmentName` y
 * `municipalityName`— y mismo **201**, y los mismos **404** cuando el
 * departamento no existe o el municipio no pertenece a ese departamento.
 *
 * ⚠️ Añade dos controles que aquí no había: techo de longitud del nombre y
 * límite de 10 altas por IP cada 15 minutos. El modal solo mira `response.ok`
 * y, si falla, `error.error`.
 */
export async function POST(request: Request) {
  return proxyToBackend(request, "/entity-suggestions");
}

// `GET /entity-suggestions` se retira en el bloque C de esta misma tarea: solo
// el panel gestiona sugerencias, y lo hace por su propia ruta.
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const where = status ? { status: status as any } : {};

    const departmentMap = new Map<string, string>();
    const municipalityMap = new Map<string, string>();

    geoData.departments.forEach((dept) => {
      departmentMap.set(dept.id, dept.name);
      dept.municipalities.forEach((mun) => {
        municipalityMap.set(mun.id, mun.name);
      });
    });

    const [suggestions, total] = await Promise.all([
      prisma.entitySuggestion.findMany({
        where,
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.entitySuggestion.count({ where }),
    ]);

    const result = suggestions.map((suggestion) => ({
      ...suggestion,
      departmentName: departmentMap.get(suggestion.regionalDepartmentId) || null,
      municipalityName: suggestion.municipalityId
        ? municipalityMap.get(suggestion.municipalityId) || null
        : null,
    }));

    return NextResponse.json({
      suggestions: result,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching entity suggestions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
