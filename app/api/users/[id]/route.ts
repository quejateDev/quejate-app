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
        name: true,
        email: true,
        image: true,
        role: true,
        phone: true,
        followers: {
          select: {
            id: true,
            name: true,
          }
        },
        following: {
          select: {
            id: true,
            name: true,
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
    if (bodyKeys.length === 1 && bodyKeys[0] === 'image') {

      if (!body.image || !isValidUrl(body.image)) {
        return NextResponse.json(
          { error: "URL de imagen no válida" },
          { status: 400 }
        );
      }

      const updatedUser = await prisma.user.update({
        where: { id },
        data: { image: body.image },
        select: {
          id: true,
          name: true,
          email: true,
          image: true
        }
      });

      return NextResponse.json(updatedUser);
    }

    const { name, phone, image, currentPassword, newPassword } = body;

    if (!name || name.trim() === '') {
      return NextResponse.json(
        { error: "Nombre es requerido" },
        { status: 400 }
      );
    }

    if (image && image.trim() !== '' && !isValidUrl(image)) {
      return NextResponse.json(
        { error: "URL de imagen no válida" },
        { status: 400 }
      );
    }

    const updateData: any = {
      name: name.trim(),
    };

    if (phone !== undefined) {
      updateData.phone = phone && phone.trim() !== '' ? phone.trim() : null;
    }

    if (image === null || image === '') {
      updateData.image = null;
    } else if (image && image.trim() !== '') {
      updateData.image = image;
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
        name: true,
        email: true,
        phone: true,
        image: true
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

export async function DELETE(
  request: Request,
  { params }: any
) {
  try {
    const { id } = await params;
    const currentUserId = await currentUser();

    if (!currentUserId) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    if (currentUserId.id !== id && currentUserId.role !== "ADMIN" && currentUserId.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "No tienes permisos para eliminar este usuario" },
        { status: 403 }
      );
    }

    const userToDelete = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    });

    if (!userToDelete) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    if (userToDelete.role === "SUPER_ADMIN" && currentUserId.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "No se puede eliminar un super administrador" },
        { status: 403 }
      );
    }

    await prisma.user.delete({
      where: { id }
    });

    return NextResponse.json(
      { 
        message: "Usuario eliminado exitosamente",
        deletedUser: {
          id: userToDelete.id,
          name: userToDelete.name,
          email: userToDelete.email
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Error al eliminar el usuario" },
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