import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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
