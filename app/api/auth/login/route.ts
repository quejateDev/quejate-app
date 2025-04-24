import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'
import { signToken } from '@/lib/utils'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        Entity: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      )
    }

    // Check if email is verified
    if (user.role === "CLIENT" && !user.emailVerified) {
      return NextResponse.json(
        { 
          error: 'Email no verificado',
          message: 'Por favor verifica tu correo electrónico antes de iniciar sesión'
        },
        { status: 403 }
      )
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      )
    }

    // Create JWT token
    const token = await signToken({
      id: user.id,
      role: user.role,
      email: user.email,
      entityId: user.Entity?.id || "",
    });

    // Remove password and verification token from response
    // @ts-ignore
    const { password: _, verificationToken: __, ...userWithoutPassword } = user

    // Create response with cookie
    const response = NextResponse.json({
      user: userWithoutPassword,
      token,
    })

    // Set token cookie
    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Error al iniciar sesión' },
      { status: 500 }
    )
  }
}