// app/api/departments/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Este listado es PUBLICO: el middleware de la web solo gatea las paginas
    // de `privateRoutes`, ninguna ruta `/api` figura ahi. Con `include` de
    // `employees` y `pqrs` Prisma devolvia todas las columnas escalares de las
    // filas relacionadas: de cada empleado el hash bcrypt de la contrasena, el
    // correo, el telefono y el token de push; de cada PQRSD la fila entera,
    // SIN filtrar por `private`, con su asunto, descripcion, datos de contacto
    // de invitado y coordenadas. Y sin `where`, las de todas las entidades.
    // Misma clase que H-06, H-09 y H-11: `include` en vez de `select`.
    //
    // Los tres campos de abajo son los unicos que lee algun cliente.
    const departments = await prisma.department.findMany({
      select: {
        id: true,
        name: true,
        entityId: true,
      },
      orderBy: {
        name: "asc",
      },
    });
    return NextResponse.json(departments);
  } catch (error) {
    console.error("Error fetching departments:", error);
    return NextResponse.json(
      { error: "Error fetching departments" },
      { status: 500 }
    );
  }
}
