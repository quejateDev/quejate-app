import { NextResponse } from "next/server";
import { uploadObject } from "@/services/storage/s3.service";
import { AWS_BUCKET, AWS_REGION } from "@/lib/config";
import { currentUser } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    // #6: subir un fichero exige sesión (cookie web o Bearer móvil). Sin esto
    // cualquiera en internet podía escribir directamente en el bucket, con
    // lectura pública y sin límite de tamaño. Crear una PQRSD ya exige sesión
    // (#5), así que no hay ningún flujo legítimo de subida anónima.
    const authUser = await currentUser();
    if (!authUser?.id) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    
    // Create unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const filename = `${uniqueSuffix}-${file.name}`;

    // Upload to S3
    await uploadObject(filename, bytes);

    return NextResponse.json({ 
      success: true,
      path: `https://${AWS_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${filename}`

    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: "Error uploading file" },
      { status: 500 }
    );
  }
}
