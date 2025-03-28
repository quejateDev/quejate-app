import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { PQRAttachments } from "@/components/pqrs/pqr-attachments";
import { PQRCustomFields } from "@/components/pqrs/pqr-custom-fields";

interface PQRDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function PQRDetailPage({ params }: PQRDetailPageProps) {
  const resolvedParams = await params;
  const pqr = await prisma.pQRS.findUnique({
    where: { id: resolvedParams.id },
    include: {
      department: {
        include: {
          entity: true,
        },
      },
      creator: true,
      customFieldValues: true,
      attachments: true,
      _count: {
        select: {
          likes: true,
        },
      },
    },
  });

  if (!pqr) {
    notFound();
  }

  const remainingDays = Math.ceil(
    (new Date(pqr.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="container mx-auto py-10 space-y-8">
      {/* Encabezado */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">
              {pqr.type} #{pqr.id}
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              {pqr.department.entity.name} - {pqr.department.name}
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Información del Creador */}
          <div>
            <h3 className="font-semibold mb-2">Creado por</h3>
            <p>
              {pqr.anonymous || !pqr.creator
                ? "Anónimo"
                : `${pqr.creator?.firstName} ${pqr.creator?.lastName}`}
            </p>
            <p className="text-sm text-muted-foreground">
              {formatDate(pqr.createdAt)}
            </p>
          </div>

          {/* Tiempo Restante */}
          <div>
            <h3 className="font-semibold mb-2">Tiempo de Respuesta</h3>
            <Badge
              variant={
                remainingDays <= 0
                  ? "destructive"
                  : remainingDays <= 3
                  ? "warning"
                  : "default"
              }
            >
              {remainingDays <= 0
                ? "Vencido"
                : `${remainingDays} días restantes`}
            </Badge>
          </div>

          {/* Campos Personalizados */}
          <PQRCustomFields fields={pqr.customFieldValues} />

          {/* Archivos Adjuntos */}
          <PQRAttachments attachments={pqr.attachments} />
        </CardContent>
      </Card>
    </div>
  );
} 