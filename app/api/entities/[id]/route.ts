import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface Params {
  params: {
    id: string;
  };
}

export async function GET(request: Request, { params }: Params) {
  if (!params.id) {
    return new NextResponse("ID is required", { status: 400 });
  }
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

export async function PUT(request: Request, { params }: Params) {
  if (!params.id) {
    return new NextResponse("ID is required", { status: 400 });
  }
  try {
    const body = await request.json();
    const { name, description, categoryId, imageUrl, email, municipalityId } = body;

    const entity = await prisma.entity.update({
      where: { id: params.id },
      data: {
        name,
        description,
        categoryId,
        imageUrl: imageUrl || null,
        email: email || null,
        municipalityId: municipalityId || null,
      },
    });

    return NextResponse.json(entity);
  } catch (error) {
    console.error("[ENTITY_PUT]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: Params) {
  if (!params.id) {
    return new NextResponse("ID is required", { status: 400 });
  }

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
