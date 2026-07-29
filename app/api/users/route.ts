import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: {
          notIn: ["ADMIN", "SUPER_ADMIN"]
        }
      },
      select: {
        id: true,
        name: true,
        // Sin `email`: este listado es público (sin sesión) y exponerlo permitía
        // cosechar correos de ciudadanos. Los datos personales solo los ve su
        // dueño (Ley 1581) — ver `GET /api/users/[id]`.
        role: true,
        image: true,
        _count: {
          select: {
            followers: true,
            following: true,
            PQRS: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50,
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Error al obtener usuarios" },
      { status: 500 }
    );
  }
}