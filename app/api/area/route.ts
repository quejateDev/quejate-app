// app/api/departments/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const areas = await prisma.department.findMany({
    include: {
      employees: true,
      forms: true,
      pqrs: true,
    },
  });
  return NextResponse.json(areas);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name } = body;

    const department = await prisma.department.create({
      data: {
        name,
      },
    });

    return NextResponse.json(department);
  } catch (error) {
    console.error('Failed to create department:', error);
    return NextResponse.json(
      { error: 'Failed to create department' },
      { status: 500 }
    );
  }
}