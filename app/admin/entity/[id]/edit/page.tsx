import { EntityForm } from '@/components/entities/entity-form'
import prisma from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { notFound } from 'next/navigation'

interface EditEntityPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditEntityPage({ params }: EditEntityPageProps) {
  const { id } = await params;
  const entity = await prisma.entity.findUnique({
    where: { id }
  })

  if (!entity) {
    notFound()
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Editar Entidad</CardTitle>
        </CardHeader>
        <CardContent>
          <EntityForm entity={entity} />
        </CardContent>
      </Card>
    </div>
  )
}
