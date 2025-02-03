import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ImageUpload } from "@/components/ui/image-upload"
import { Form } from "@/components/ui/form"

const formSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  imageUrl: z.string().url(),
  entityId: z.string(),
  // ... otros campos
})

export function DepartmentForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      imageUrl: "",
      entityId: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await fetch('/api/departments', {
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
        <ImageUpload 
          form={form} 
          name="imageUrl" 
          label="Imagen del área" 
        />
        {/* ... botones ... */}
      </form>
    </Form>
  )
} 