import { NextResponse } from "next/server";
import { uploadObject } from "@/services/storage/s3.service";
import { AWS_BUCKET, AWS_REGION } from "@/lib/config";

export async function POST(request: Request) {
  try {
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
