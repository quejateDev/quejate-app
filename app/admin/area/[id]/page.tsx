import { AreaForm } from "@/components/forms/area-form"
import { PQRConfigForm } from "@/components/forms/pqr-config-form"
import PqrFieldsForm from "@/components/forms/pqr-fields-form"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"

interface AreaPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function AreaPage({ params }: AreaPageProps) {
  const { id } = await params;
  const area = await prisma.department.findUnique({
    where: { id },
    include: {
      pqrConfig: {
        include: {
          customFields: true
        }
      },
    },
  })

  if (!area) {
    notFound()
  }

  return (
    <div className="flex flex-col gap-4 mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Editar Área</CardTitle>
          <CardDescription>
            Edita la información de un área existente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AreaForm
            initialData={{
              id: area.id,
              name: area.name,
            }}
            isEditing={true}
          />
        </CardContent>
      </Card>

      <PQRConfigForm 
        areaId={area.id} 
        initialData={{
          allowAnonymous: area.pqrConfig?.allowAnonymous || false,
          requireEvidence: area.pqrConfig?.requireEvidence || false,
          maxResponseTime: area.pqrConfig?.maxResponseTime ? area.pqrConfig.maxResponseTime.toString() : "15",
          notifyEmail: area.pqrConfig?.notifyEmail || true,
          autoAssign: area.pqrConfig?.autoAssign || false,
        }} 
      />

      <PqrFieldsForm 
        areaId={area.id} 
        initialData={{
          customFields: area.pqrConfig?.customFields?.map(field => ({
            name: field.name,
            required: field.required,
            type: field.type as "text" | "email" | "phone"
          })) || [],
        }} 
      />
    </div>
  )
}
