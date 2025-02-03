import { NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { randomUUID } from 'crypto'

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

export async function POST(request: Request) {
  try {
    const { filename, contentType, folder = 'uploads' } = await request.json()
    
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

    console.log('Generated URL:', url)
    console.log('Bucket:', process.env.AWS_BUCKET)
    console.log('Key:', key)

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