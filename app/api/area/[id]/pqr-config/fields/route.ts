import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { PqrFieldsSchema } from "@/types/pqr-config";

export async function PUT(
  request: Request,
  { params }: any
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { customFields } = PqrFieldsSchema.parse(body);
    
    // Update or create PQR config with custom fields
    const pqrConfig = await prisma.pQRConfig.update({
      where: {
        departmentId: id,
      },
      data: {
        customFields: {
          deleteMany: {},  // Remove all existing fields
          create: customFields.map((field) => ({

            name: field.name,
            type: field.type,
            required: field.required,
            placeholder: field.placeholder,
          })),
        },
      },
    });

    return NextResponse.json(pqrConfig);
  } catch (error) {
    console.error("[PQR_CONFIG_FIELDS]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
