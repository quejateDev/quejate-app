"use client"

import { Input } from "@/components/ui/input"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useS3Upload } from "@/hooks/use-s3-upload"
import { FileIcon, Loader2, X } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { toast } from "@/hooks/use-toast"
import { UseFormReturn } from "react-hook-form"
import { Button } from "./button"

interface FileUploadProps {
  form: UseFormReturn<any>
  name: string
  label: string
  folder?: string
  multiple?: boolean
  accept?: string
  maxSize?: number // en MB
}

export function FileUpload({ 
  form, 
  name, 
  label, 
  folder = 'uploads',
  multiple = false,
  accept = "*",
  maxSize = 5 // 5MB por defecto
}: FileUploadProps) {
  const [files, setFiles] = useState<string[]>(
    multiple ? form.getValues(name) || [] : [form.getValues(name)]
  )

  const { upload, isUploading } = useS3Upload({
    onSuccess: (url, file) => {
      if (multiple) {
        const currentFiles = form.getValues(name) || []
        form.setValue(name, [...currentFiles, {
          url,
          size: file.size
        }])
        setFiles([...files, url])
      } else {
        form.setValue(name, {
          url,
          size: file.size
        })
        setFiles([url])
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Error al subir el archivo",
        variant: "destructive",
      })
    },
    folder
  })

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files
    if (!selectedFiles?.length) return

    for (const file of Array.from(selectedFiles)) {
      // Validar tamaño
      if (file.size > maxSize * 1024 * 1024) {
        toast({
          title: "Error",
          description: `El archivo no debe superar los ${maxSize}MB`,
          variant: "destructive",
        })
        return
      }

      try {
        await upload(file)
      } catch (error) {
        console.error('Upload error:', error)
      }
    }
  }

  const removeFile = (fileUrl: string) => {
    if (multiple) {
      const newFiles = files.filter(f => f !== fileUrl)
      form.setValue(name, newFiles)
      setFiles(newFiles)
    } else {
      form.setValue(name, '')
      setFiles([])
    }
  }

  const isImage = (url: string) => {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(url)
  }

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="flex flex-col gap-4">
              <Input
                type="file"
                accept={accept}
                onChange={handleFileUpload}
                disabled={isUploading}
                className="cursor-pointer"
                multiple={multiple}
              />
              {isUploading && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Subiendo archivo...
                </div>
              )}
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {files.filter(Boolean).map((file, index) => (
                  <div key={index} className="relative group">
                    {isImage(file) ? (
                      <div className="relative aspect-video overflow-hidden rounded-lg border">
                        <Image
                          src={file}
                          alt="Preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex aspect-video items-center justify-center rounded-lg border">
                        <FileIcon className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -right-2 -top-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100"
                      onClick={() => removeFile(file)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <Input type="hidden" {...field} />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
} 