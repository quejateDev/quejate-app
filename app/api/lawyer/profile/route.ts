import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { currentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await currentUser();
    const userId = user?.id;

    if (!userId) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    const lawyer = await prisma.lawyer.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            profilePicture: true,
            email: true,
            phone: true,
            isVerified: true
          }
        },
        receivedRatings: true
      }
    });

    if (!lawyer) {
      return NextResponse.json(
        { error: "Perfil de abogado no encontrado" },
        { status: 404 }
      );
    }

    const averageRating = lawyer.receivedRatings.length > 0 
      ? lawyer.receivedRatings.reduce((sum, rating) => sum + rating.score, 0) / lawyer.receivedRatings.length
      : 0;

    return NextResponse.json({
      ...lawyer,
      averageRating,
      ratingCount: lawyer.receivedRatings.length
    });

  } catch (error) {
    console.error("Error fetching lawyer profile:", error);
    return NextResponse.json(
      { error: "Error al obtener el perfil del abogado" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await currentUser();
    const userId = user?.id;

    if (!userId) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { description, feePerHour, specialties } = body;

    const existingLawyer = await prisma.lawyer.findUnique({
      where: { userId }
    });

    if (!existingLawyer) {
      return NextResponse.json(
        { error: "Perfil de abogado no encontrado" },
        { status: 404 }
      );
    }

    const updatedLawyer = await prisma.lawyer.update({
      where: { userId },
      data: {
        description: description || existingLawyer.description,
        feePerHour: feePerHour !== undefined ? feePerHour : existingLawyer.feePerHour,
        specialties: specialties || existingLawyer.specialties,
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            profilePicture: true,
            email: true
          }
        },
        receivedRatings: true
      }
    });

    const averageRating = updatedLawyer.receivedRatings.length > 0 
      ? updatedLawyer.receivedRatings.reduce((sum, rating) => sum + rating.score, 0) / updatedLawyer.receivedRatings.length
      : 0;

    return NextResponse.json({
      ...updatedLawyer,
      averageRating,
      ratingCount: updatedLawyer.receivedRatings.length
    });

  } catch (error) {
    console.error("Error updating lawyer profile:", error);
    return NextResponse.json(
      { error: "Error al actualizar el perfil del abogado" },
      { status: 500 }
    );
  }
}
