import { notFound } from "next/navigation";
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

async function getPQRById(id: string) {
  try {
    // Replace this with your actual API call or database query
    const response = await getPQRSById(id);
    return response;
  } catch (error) {
    console.error("Error fetching PQR:", error);
    return null;
  }
}

export default async function PQRDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const pqr = await getPQRById(id);

  if (!pqr) {
    notFound();
  }

  return (
    <div className="container mx-auto p-6">
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
                  <Badge variant={pqr.status === "OPEN" ? "default" : "secondary"}>
                    {pqr.status === "OPEN" ? "ABIERTO" : "CERRADO"}
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

          {/* Descripción */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Descripción</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {pqr.description}
            </p>
          </div>

          {/* Respuesta (si está disponible) */}
          {pqr.response && (
            <>
              <Separator className="my-6" />
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Respuesta</h3>
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-muted-foreground whitespace-pre-wrap">
                      {pqr.response}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
