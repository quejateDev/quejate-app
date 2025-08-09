import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from 'bcryptjs';
import { currentUser } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: any
) {
  try {
    const { id } = await params;
    const currentUserId = await currentUser();

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        profilePicture: true,
        role: true,
        phone: true,
        followers: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          }
        },
        following: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          }
        },
        _count: {
          select: {
            followers: true,
            following: true,
            PQRS: true,
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    let isFollowing = false;
    if (currentUserId) {
      const followCheck = await prisma.user.findFirst({
        where: {
          id: currentUserId.id,
          following: {
            some: {
              id: user.id,
            },
          },
        },
      });
      isFollowing = !!followCheck;
    }

    return NextResponse.json({ 
      ...user,
      isFollowing 
    }, {
      headers: {
        'Cache-Control': 'public, max-age=60'
      }
    });

  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Error al obtener el perfil del usuario" },
      { status: 500 }
    );
  }

}

export async function PATCH(
  request: Request,
  { params }: any
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const currentUserId = await currentUser();

    if (!currentUserId) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    if (currentUserId.id !== id) {
      return NextResponse.json(
        { error: "No tienes permiso para actualizar este perfil" },
        { status: 403 }
      );
    }

    const bodyKeys = Object.keys(body);
    if (bodyKeys.length === 1 && bodyKeys[0] === 'profilePicture') {

      if (!body.profilePicture || !isValidUrl(body.profilePicture)) {
        return NextResponse.json(
          { error: "URL de imagen no válida" },
          { status: 400 }
        );
      }

      const updatedUser = await prisma.user.update({
        where: { id },
        data: { profilePicture: body.profilePicture },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          profilePicture: true
        }
      });

      return NextResponse.json(updatedUser);
    }

    const { firstName, lastName, phone, profilePicture, currentPassword, newPassword } = body;

    if (!firstName || !lastName || !phone || firstName.trim() === '' || lastName.trim() === '' || phone.trim() === '') {
      return NextResponse.json(
        { error: "Nombre, apellido y teléfono son requeridos" },
        { status: 400 }
      );
    }

    if (profilePicture && profilePicture.trim() !== '' && !isValidUrl(profilePicture)) {
      return NextResponse.json(
        { error: "URL de imagen no válida" },
        { status: 400 }
      );
    }

    const updateData: any = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim(),
    };

    if (profilePicture === null || profilePicture === '') {
      updateData.profilePicture = null;
    } else if (profilePicture && profilePicture.trim() !== '') {
      updateData.profilePicture = profilePicture;
    }

    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: "Contraseña actual es requerida para cambiar la contraseña" },
          { status: 400 }
        );
      }

      const user = await prisma.user.findUnique({
        where: { id },
        select: { password: true }
      });

      if (!user) {
        return NextResponse.json(
          { error: "Usuario no encontrado" },
          { status: 404 }
        );
      }

      if (!user.password || typeof user.password !== 'string') {
        return NextResponse.json(
          { error: "Contraseña actual incorrecta" },
          { status: 400 }
        );
      }

      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);

      if (!isCurrentPasswordValid) {
        return NextResponse.json(
          { error: "Contraseña actual incorrecta" },
          { status: 400 }
        );
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      updateData.password = hashedNewPassword;
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        profilePicture: true
      }
    });

    return NextResponse.json(updatedUser);

  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json(
      { error: "Error al actualizar el perfil" },
      { status: 500 }
    );
  }
}

function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}