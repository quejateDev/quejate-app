import { Input } from "@/components/ui/input"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useS3Upload } from "@/hooks/use-s3-upload"
import { ImageIcon, Loader2 } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { toast } from "@/hooks/use-toast"
import { UseFormReturn } from "react-hook-form"

interface ImageUploadProps {
  form: UseFormReturn<any>
  name: string
  label: string
  folder?: string
}

export function ImageUpload({ form, name, label, folder = 'uploads' }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(form.getValues(name) || null)
  const { upload, isUploading } = useS3Upload({
    onSuccess: (url) => {
      form.setValue(name, url)
      setPreview(url)
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Error al subir la imagen",
        variant: "destructive",
      })
    },
    folder
  })

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Solo se permiten imágenes",
        variant: "destructive",
      })
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "La imagen no debe superar los 5MB",
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
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUploading}
                className="cursor-pointer"
              />
              {isUploading && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Subiendo imagen...
                </div>
              )}
              {preview ? (
                <div className="relative aspect-video w-full max-w-sm overflow-hidden rounded-lg">
                  <Image
                    src={preview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="flex aspect-video w-full max-w-sm items-center justify-center rounded-lg border border-dashed">
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
              <Input type="hidden" {...field} />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
} 