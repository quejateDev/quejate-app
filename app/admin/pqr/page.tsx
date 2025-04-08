import PqrVsDepartmentChart from "@/components/charts/pqr/pqr-vs-deparment";
import { PqrVsTimeChart } from "@/components/charts/pqr/pqr-vs-time";
import { PqrFilters } from "@/components/pqr/pqr-filters";
import { PQRTable } from "@/components/pqr/pqr-table";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/utils";
import { getCookie } from "@/lib/utils";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Clock, AlertTriangle, CheckCircle } from "lucide-react";
import { PQRSStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    categoryId?: string;
    entityId?: string;
    departmentId?: string;
    startDate?: string;
    endDate?: string;
  }>;
}

export default async function PQRPage({ searchParams }: PageProps) {
  const token = await getCookie("token");
  if (!token) {
    return redirect("/login");
  }
  const decoded = await verifyToken(token);
  if (!decoded) {
    return redirect("/login");
  }

  const { departmentId, entityId, categoryId, startDate, endDate } =
    await searchParams;

  // Build the where clause based on filters
  const where: any = {
    department: {
      entityId: decoded.entityId,
    },
  };

  // Add department filter if provided
  if (departmentId) {
    where.departmentId = departmentId;
  }

  // Add entity filter if provided
  if (entityId) {
    where.department = {
      ...where.department,
      entityId: entityId,
    };
  }

  // Add category filter if provided
  if (categoryId) {
    where.department = {
      ...where.department,
      entity: {
        categoryId: categoryId,
      },
    };
  }

  // Add date range filter if provided
  if (startDate || endDate) {
    where.createdAt = {};

    if (startDate) {
      where.createdAt.gte = new Date(startDate);
    }

    if (endDate) {
      // Add one day to include the entire end date
      const endDateObj = new Date(endDate);
      endDateObj.setDate(endDateObj.getDate() + 1);
      where.createdAt.lt = endDateObj;
    }
  }

  const [pqrs, departments] = await Promise.all([
    prisma.pQRS.findMany({
      where,
      include: {
        department: {
          include: {
            entity: {
              include: {
                category: true,
              },
            },
          },
        },
        creator: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.department.findMany({
      include: {
        entity: true,
      },
      where: {
        entityId: decoded.entityId,
      },
    }),
  ]);

  // Calculate statistics
  const totalPqrs = pqrs.length;
  const pendingPqrs = pqrs.filter((pqr) => {
    const dueDate = new Date(pqr.createdAt);
    dueDate.setDate(dueDate.getDate() + 15);
    return new Date() < dueDate;
  }).length;
  const overduePqrs = pqrs.filter((pqr) => {
    const dueDate = new Date(pqr.createdAt);
    dueDate.setDate(dueDate.getDate() + 15);
    return new Date() >= dueDate;
  }).length;
  const completedPqrs = pqrs.filter(
    (pqr) => pqr.status === PQRSStatus.RESOLVED
  ).length;

  return (
    <div className="flex flex-col gap-6">
      {/* Header with title and filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Gestión de PQRSD
          </h1>
          <p className="text-muted-foreground mt-1">
            Administra y monitorea las PQRSD de tu entidad
          </p>
        </div>
        <PqrFilters
          departments={departments}
          startDate={startDate ?? null}
          endDate={endDate ?? null}
        />
      </div>

      {/* Statistics cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total PQRSD</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPqrs}</div>
            <p className="text-xs text-muted-foreground">
              Solicitudes en el período seleccionado
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingPqrs}</div>
            <p className="text-xs text-muted-foreground">
              PQRSD dentro del plazo de respuesta
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Vencidas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {overduePqrs}
            </div>
            <p className="text-xs text-muted-foreground">
              PQRSD fuera del plazo de respuesta
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {completedPqrs}
            </div>
            <p className="text-xs text-muted-foreground">
              PQRSD resueltas exitosamente
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PqrVsTimeChart
          pqrs={pqrs.sort(
            (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
          )}
          className="col-span-2"
        />

        <PqrVsDepartmentChart pqrs={pqrs} />
      </div>

      {/* Table section */}
      <Card>
        <CardHeader>
          <CardTitle>Listado de PQRSD</CardTitle>
        </CardHeader>
        <CardContent>
          <PQRTable pqrs={pqrs} />
        </CardContent>
      </Card>
    </div>
  );
}
