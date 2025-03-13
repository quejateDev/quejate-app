import { Input } from "@/components/ui/input"
import { useS3Upload } from "@/hooks/use-s3-upload"
import { toast } from "@/hooks/use-toast"
import { Form } from "react-hook-form"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

const formSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(10),
  attachments: z.array(z.string().url()),
  departmentId: z.string(),
  // ... otros campos
})

export function PQRForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      attachments: [],
      departmentId: "",
    },
  })

  const { upload } = useS3Upload({
    onSuccess: (url) => {
      const currentAttachments = form.getValues('attachments')
      form.setValue('attachments', [...currentAttachments, url])
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Error al subir el archivo",
        variant: "destructive",
      })
    },
    folder: 'pqr'
  })

  // Para PQRs podríamos necesitar múltiples archivos
  const handleMultipleFiles = async (files: FileList) => {
    const uploadedUrls = []
    for (const file of Array.from(files)) {
      try {
        const url = await upload(file)
        uploadedUrls.push(url)
      } catch (error) {
        console.error('Upload error:', error)
      }
    }
    form.setValue('attachments', [...form.getValues('attachments'), ...uploadedUrls])
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await fetch('/api/pqrs', {
        method: 'POST',
        body: JSON.stringify(values)
      })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* ... otros campos ... */}
        <Input 
          type="file" 
          multiple 
          accept="image/*,.pdf,.doc,.docx" 
          onChange={(e) => e.target.files && handleMultipleFiles(e.target.files)}
        />
        {/* ... botones ... */}
      </form>
    </Form>
  )
} 