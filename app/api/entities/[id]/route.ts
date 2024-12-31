import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const entity = await prisma.entity.findUnique({
      where: { id: params.id },
      include: {
        category: true,
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

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, description, categoryId, imageUrl } = body;

    const entity = await prisma.entity.update({
      where: { id: params.id },
      data: {
        name,
        description,
        categoryId,
        imageUrl,
      },
    });

    return NextResponse.json(entity);
  } catch (error) {
    console.error("[ENTITY_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.entity.delete({
      where: { id: params.id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[ENTITY_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
