import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { identityDocument, licenseNumber } = await req.json();
    if (!identityDocument && !licenseNumber) {
      return NextResponse.json({ error: "Falta el número de documento o licencia" }, { status: 400 });
    }

    let existsIdentity = false;
    let existsLicense = false;

    if (identityDocument) {
      const existingLawyer = await prisma.lawyer.findUnique({
        where: { identityDocument },
        select: { id: true },
      });
      existsIdentity = !!existingLawyer;
    }

    if (licenseNumber) {
      const existingLicense = await prisma.lawyer.findUnique({
        where: { licenseNumber },
        select: { id: true },
      });
      existsLicense = !!existingLicense;
    }

    return NextResponse.json({ existsIdentity, existsLicense });
  } catch (error) {
    return NextResponse.json({ error: "Error validando el documento o licencia" }, { status: 500 });
  }
}
