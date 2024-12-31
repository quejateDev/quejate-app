import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: any
) {
  try {
    const { id } = await params;

    const body = await req.json();
    const {
      allowAnonymous,
      requireEvidence,
      maxResponseTime,
      notifyEmail,
      autoAssign,
    } = body;

    await prisma.pQRConfig.upsert({
      where: {
        departmentId: id,
      },
      update: {
        allowAnonymous,
        requireEvidence,
        maxResponseTime: parseInt(maxResponseTime),
        notifyEmail,
        autoAssign,
        // customFields,
      },
      create: {
        department: {
          connect: {
            id,
          },
        },
        allowAnonymous,
        requireEvidence,
        maxResponseTime: parseInt(maxResponseTime),
        notifyEmail,
        autoAssign,
      },
    });

    return NextResponse.json({});
  } catch (error) {
    console.error("[PQR_CONFIG_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(
  req: NextRequest,
  { params }: any 
) {
  try {
    // const session = await getServerSession(authOptions);
    // if (!session) {
    //   return new NextResponse("Unauthorized", { status: 401 });
    // }
    const { id } = await params;

    const pqrConfig = await prisma.pQRConfig.findUnique({
      where: {
        departmentId: id,
      },
      include: {
        customFields: true,
      }
    });

    return NextResponse.json(pqrConfig);
  } catch (error) {
    console.error("[PQR_CONFIG_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
