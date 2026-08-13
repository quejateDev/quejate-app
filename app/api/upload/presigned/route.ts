import { NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { randomUUID } from 'crypto'
import { currentUser } from '@/lib/auth'

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

export async function POST(request: Request) {
  try {
    // #6: firmar una subida exige sesión (cookie web o Bearer móvil). Sin esto
    // cualquiera en internet podía pedir una URL prefirmada y escribir en el
    // bucket, con lectura pública, sin límite de tamaño y eligiendo la ruta.
    // Crear una PQRSD ya exige sesión (#5), así que no hay ningún flujo
    // legítimo de subida anónima.
    const authUser = await currentUser()
    if (!authUser?.id) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const { filename, contentType, folder = 'uploads' } = await request.json()

    // if (!ALLOWED_MIME_TYPES.includes(contentType)) {
    //   return NextResponse.json(
    //     { error: `Tipo de archivo no permitido. Solo se aceptan: ${ALLOWED_MIME_TYPES.join(', ')}` },
    //     { status: 400 }
    //   )
    // }
    
    // Generate unique filename with folder structure
    const key = `${folder}/${randomUUID()}-${filename}`

    // Create command with specific ACL
    const putObjectCommand = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET!,
      Key: key,
      ContentType: contentType,
      ACL: 'public-read',
    })

    // Generate presigned URL with minimal headers
    const url = await getSignedUrl(s3Client, putObjectCommand, { 
      expiresIn: 3600,
    })

    return NextResponse.json({
      url,
      key,
      bucket: process.env.AWS_BUCKET
    })
  } catch (error) {
    console.error('Presigned URL error:', error)
    return NextResponse.json(
      { error: 'Error generating upload URL', details: error },
      { status: 500 }
    )
  }
} 