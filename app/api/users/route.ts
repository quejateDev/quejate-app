import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {

    const userId = req.headers.get("x-user-id");

    let followingIds: string[] = [];
    if (userId) {
      const currentUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { following: { select: { id: true } } },
      });
      followingIds = currentUser?.following.map(f => f.id) ?? [];
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        profilePicture: true,
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

    const usersWithIsFollowing = users.map(u => ({
      ...u,
      isFollowing: followingIds.includes(u.id),
    }));

    return NextResponse.json(usersWithIsFollowing);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Error al obtener usuarios" },
      { status: 500 }
    );
  }
}