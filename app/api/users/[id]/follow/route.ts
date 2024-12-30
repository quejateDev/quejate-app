import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const authCookie = cookieStore.get('auth-storage');
    const currentUser = authCookie ? JSON.parse(authCookie.value).state.user : null;

    if (!currentUser) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Check if already following
    const existingFollow = await prisma.user.findFirst({
      where: {
        id: currentUser.id,
        following: {
          some: {
            id: userId,
          },
        },
      },
    });

    if (existingFollow) {
      // Unfollow
      await prisma.user.update({
        where: { id: currentUser.id },
        data: {
          following: {
            disconnect: { id: userId },
          },
        },
      });
      return NextResponse.json({ followed: false });
    } else {
      // Follow
      await prisma.user.update({
        where: { id: currentUser.id },
        data: {
          following: {
            connect: { id: userId },
          },
        },
      });
      return NextResponse.json({ followed: true });
    }
  } catch (error) {
    console.error("Error in follow/unfollow:", error);
    return NextResponse.json(
      { error: "Error processing follow/unfollow" },
      { status: 500 }
    );
  }
}
