import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendVerificationEmail } from "@/services/email/Resend.service";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { error: "Email is already verified" },
        { status: 400 }
      );
    }

    if (!user.verificationToken) {
      return NextResponse.json(
        { error: "Verification token not found" },
        { status: 404 }
      );
    }

    // Send verification email
    await sendVerificationEmail(email, user.verificationToken);

    return NextResponse.json({ 
      message: "Verification email sent successfully" 
    });

  } catch (error) {
    console.error("Error resending verification email:", error);
    return NextResponse.json(
      { error: "Error resending verification email" },
      { status: 500 }
    );
  }
}
