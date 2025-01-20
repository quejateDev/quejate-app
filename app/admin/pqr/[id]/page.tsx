import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getPQRSById } from "@/services/api/pqr.service";
import prisma from "@/lib/prisma";

export default async function PQRDetailPage({
  params,
}: {
  params: any;
}) {
  const { id } = await params;
  const pqr = await prisma.pQRS.findUnique({
    where: {
      id,
    },
    include: {
      department: true,
      creator: true,
      customFieldValues: true,
      attachments: true
    },
  });

  if (!pqr) {
    return;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Detalles de la PQR</CardTitle>
          <CardDescription>
            Ver información detallada sobre esta solicitud PQR
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Información Básica */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Información Básica</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ID</span>
                  <span>{pqr.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tipo</span>
                  <span>{pqr.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estado</span>
                  <Badge variant={pqr.status === "PENDING" ? "default" : "secondary"}>
                    {pqr.status === "IN_PROGRESS" ? "ABIERTO" : "CERRADO"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Creado</span>
                  <span>{new Date(pqr.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Información del Cliente */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Información del Cliente</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nombre</span>
                  <span>{pqr.creator?.firstName} {pqr.creator?.lastName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Correo</span>
                  <span>{pqr.creator?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Teléfono</span>
                  <span>{pqr.creator?.phone}</span>
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Custom Fields */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Información Adicional</h3>
            <div className="grid gap-4">
              {pqr.customFieldValues.map((field) => (
                <div key={field.id} className="space-y-2">
                  <h4 className="font-medium text-sm">{field.name}</h4>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {field.value || "No especificado"}
                  </p>
                </div>
              ))}
            </div>
          </div>

        
        </CardContent>
      </Card>

      {/* Attachments Section */}
      {/* <PQRAttachments attachments={pqr.attachments} /> */}
    </div>
  );
}
