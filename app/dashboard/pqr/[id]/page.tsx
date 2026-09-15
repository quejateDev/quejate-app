import { notFound } from "next/navigation";
import { backendFetch, BackendError } from "@/lib/api/backend";
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

/** Lo que esta página lee de `GET /pqr/:id`; el detalle trae bastante más. */
interface PqrDetail {
  consecutiveCode: string | null;
  type: keyof typeof typeMap;
  status: keyof typeof statusMap;
  subject: string | null;
  description: string | null;
  anonymous: boolean;
  createdAt: string;
  entity: { name: string; email: string | null };
  department: { name: string } | null;
  creator: { name: string | null } | null;
  customFieldValues: Array<{ name: string; value: string }>;
  attachments: Array<{ name: string; url: string; type: string }>;
}

export default async function PQRDetailPage({ params }: PQRDetailPageProps) {
  const resolvedParams = await params;

  // B-09: esta página leía Prisma y comprobaba la privacidad por su cuenta
  // (H-22). Ahora la comprueba el backend, con **la misma regla** —el autor o
  // un rol EMPLOYEE/ADMIN/SUPER_ADMIN— y con una mejora: `JweAuthGuard` relee
  // el rol fresco de la base en cada petición, mientras que aquí se confiaba
  // en el que viajaba dentro del token de sesión.
  //
  // 404 y 403 se responden igual, y es deliberado: en una página el 403
  // confirmaría que ese identificador existe, que es justo lo que no conviene
  // decirle a quien no puede leerla. Es la decisión que ya tomó H-22.
  const response = await backendFetch(
    `/pqr/${encodeURIComponent(resolvedParams.id)}`,
  );
  if (response.status === 404 || response.status === 403) {
    notFound();
  }
  if (!response.ok) {
    throw await BackendError.from(response, "/pqr/:id");
  }
  const pqr = (await response.json()) as PqrDetail;

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

            {pqr.entity.email && (
              <>
                <div className="font-semibold">Correo de la entidad:</div>
                <div>{pqr.entity.email}</div>
              </>
            )}

            <div className="font-semibold">Ciudadano:</div>
            <div>
              {/* `guestName` ya no llega: el backend retiró los campos
                  `guest*` de la salida en la Tarea 21 (siguen en la entrada).
                  Una PQRSD radicada sin cuenta se muestra ahora como
                  «Usuario no registrado». */}
              {pqr.anonymous
                ? "Anónimo"
                : pqr.creator?.name ?? "Usuario no registrado"}
            </div>

            <div className="font-semibold">Tipo de requerimiento:</div>
            <div>{typeMap[pqr.type].label}</div>

            <div className="font-semibold">Asunto:</div>
            <div>{pqr.subject}</div>

            <div className="font-semibold">Fecha de creación:</div>
            <div>{formatDate(pqr.createdAt)}</div>

            <div className="font-semibold">Fecha límite de respuesta:</div>
            <div>{formatDateWithoutTime(calculateDueDate(new Date(pqr.createdAt)))}</div>

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