import { useState } from 'react'

interface UseS3UploadOptions {
  onSuccess?: (url: string, file: File) => void
  onError?: (error: Error) => void
  folder?: string
}

export function useS3Upload(options: UseS3UploadOptions = {}) {
  const [isUploading, setIsUploading] = useState(false)

  const upload = async (file: File) => {
    try {
      setIsUploading(true)

      // 1. Get presigned URL
      const presignedResponse = await fetch('/api/upload/presigned', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
          folder: options.folder || 'uploads'
        }),
      })

      if (!presignedResponse.ok) {
        const errorData = await presignedResponse.json()
        throw new Error(`Failed to get upload URL: ${JSON.stringify(errorData)}`)
      }

      const { url, key, bucket } = await presignedResponse.json()

      // 2. Upload to S3
      const uploadResponse = await fetch(url, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      })

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text()
        throw new Error(`Upload failed: ${uploadResponse.status} ${errorText}`)
      }

      // Construct S3 URL without region if not available
      const fileUrl = process.env.NEXT_PUBLIC_AWS_REGION 
        ? `https://${bucket}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${key}`
        : `https://${bucket}.s3.amazonaws.com/${key}`
      
      options.onSuccess?.(fileUrl, file)
      return fileUrl

    } catch (error) {
      console.error('Upload error:', error)
      options.onError?.(error as Error)
      throw error
    } finally {
      setIsUploading(false)
    }
  }

  return {
    upload,
    isUploading
  }
} 