import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { error: 'Token no proporcionado' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { verificationToken: token },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 400 }
      )
    }

    // Update user as verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        verificationToken: null,
      },
    })

    return NextResponse.json({ message: 'Email verificado correctamente' })
  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.json(
      { error: 'Error al verificar el email' },
      { status: 500 }
    )
  }
}
