import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { connect } from "http2";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    // const session = await getServerSession(authOptions);
    // if (!session) {
    //   return new NextResponse("Unauthorized", { status: 401 });
    // }

    const body = await req.json();
    const {
      allowAnonymous,
      requireEvidence,
      maxResponseTime,
      notifyEmail,
      autoAssign,
      customFields,
    } = body;

    const pqrConfig = await prisma.pQRConfig.upsert({
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
        // customFields,
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
  { params }: { params: { id: string } }
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
