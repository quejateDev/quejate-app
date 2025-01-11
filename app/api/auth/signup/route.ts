import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import {sendVerificationEmail } from '@/services/email/Resend.service';

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, phone, password } = body

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex')

    // Create user with verification token
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        password: hashedPassword,
        role: 'CLIENT',
        verificationToken,
      },
    })

    // Send verification email
    console.log('sendVerificationEmail', process.env.NEXT_PUBLIC_APP_URL)
    
    await sendVerificationEmail(email, verificationToken)

    // Remove password from response
    // @ts-ignore
    const { password: _, verificationToken: __, ...userWithoutPassword } = user

    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Error creating user' },
      { status: 500 }
    )
  }
}