import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hash } from "bcryptjs";

export async function GET(
  req: Request,
  { params }: any 
) {
  const { id } = await params;

  try {
    const client = await prisma.user.findUnique({
      where: {
        id
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!client) {
      return NextResponse.json(
        { error: "Client not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(client);
  } catch (error) {
    console.error("Error fetching client:", error);
    return NextResponse.json(
      { error: "Error fetching client" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: any
) {
  const { id } = await params;
  try {
    const body = await req.json();

    let newPassword = undefined;

    if (body.password) {
      newPassword = await hash(body.password, 10);
    }

    const client = await prisma.user.update({
      where: {
        id
      },
      data: {
        ...body,
        ...(newPassword ? { password: newPassword } : {}),
      },
    });

    return NextResponse.json(client);
  } catch (error) {
    console.error("Error updating client:", error);
    return NextResponse.json(
      { error: "Error updating client" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params } : any
) {
  const { id } = await params;
  try {
    await prisma.user.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting client:", error);
    return NextResponse.json(
      { error: "Error deleting client" },
      { status: 500 }
    );
  }
}
