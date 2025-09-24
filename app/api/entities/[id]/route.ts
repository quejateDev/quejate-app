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

export async function PUT(request: Request, { params }: any) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      name,
      description,
      categoryId,
      imageUrl,
      email,
      municipalityId,
      isVerified,
    } = body;

    const entity = await prisma.entity.update({
      where: { id },
      data: {
        name,
        description,
        categoryId,
        imageUrl: imageUrl || undefined,
        email: email || undefined,
        municipalityId: municipalityId || undefined,
        isVerified,
      },
    });

    return NextResponse.json(entity);
  } catch (error) {
    console.error("[ENTITY_PUT]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: any) {
  try {
    const { id } = await params;
    await prisma.entity.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[ENTITY_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
