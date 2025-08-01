import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatDateWithoutTime } from "@/lib/dateUtils";
import { PQRAttachments } from "@/components/pqr/pqr-attachments";
import { PQRCustomFields } from "@/components/pqr/pqr-custom-fields";
import { statusMap, typeMap } from "@/constants/pqrMaps";
import { calculateDueDate } from "@/utils/dateHelpers";

interface PQRDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function PQRDetailPage({ params }: PQRDetailPageProps) {
  const resolvedParams = await params;
  const pqr = await prisma.pQRS.findUnique({
    where: { id: resolvedParams.id },
    include: {
      entity: true,
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
      <Card>
        <CardHeader className="bg-muted py-3 mb-6 rounded-t-md">
          <CardTitle className="text-2xl font-bold text-start">
            No. Radicado {pqr.consecutiveCode}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="font-semibold">Entidad a la cual se realizó la solicitud:</div>
            <div>{pqr.entity.name}</div>

            <div className="font-semibold">Ciudadano:</div>
            <div>
              {pqr.anonymous || !pqr.creator
                ? "Anónimo"
                : `${pqr.creator?.firstName} ${pqr.creator?.lastName}`}
            </div>

            <div className="font-semibold">Tipo de requerimiento:</div>
            <div>{typeMap[pqr.type].label}</div>

            <div className="font-semibold">Asunto:</div>
            <div>{pqr.subject}</div>

            <div className="font-semibold">Fecha de creación:</div>
            <div>{formatDate(pqr.createdAt)}</div>

            <div className="font-semibold">Plazo máximo de respuesta:</div>
            <div>{formatDateWithoutTime(calculateDueDate(pqr.createdAt))}</div>

            <div className="font-semibold">Estado:</div>
            <div>
              <Badge variant={statusMap[pqr.status].variant}>
                {statusMap[pqr.status].label}
              </Badge>
            </div>

            {pqr.department && (
              <>
                <div className="font-semibold">Departamento y municipio:</div>
                <div>{pqr.department.name}</div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="bg-muted py-3 mb-6 rounded-t-md">
          <CardTitle className="text-xl font-bold">Contenido de la Solicitud</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold">Asunto:</h3>
            <p className="text-gray-700">{pqr.subject}</p>

            <h3 className="font-semibold mt-4">Descripción:</h3>
            <p className="text-gray-700">{pqr.description}</p>
          </div>

          <PQRCustomFields fields={pqr.customFieldValues} />

          <PQRAttachments attachments={pqr.attachments} />
        </CardContent>
      </Card>
    </div>
  );
} 