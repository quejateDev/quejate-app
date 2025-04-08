import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DeparmentsTable } from "@/components/DeparmentsTable";
import prisma from "@/lib/prisma";
import { getCookie, verifyToken } from "@/lib/utils";
import { redirect } from "next/navigation";
import { Building2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
export const dynamic = "force-dynamic";

export default async function AreasPage() {
  const token = await getCookie("token");
  if (!token) {
    return redirect("/login");
  }
  const decoded = await verifyToken(token);
  if (!decoded) {
    return redirect("/login");
  }
  const departments = await prisma.department.findMany({
    include: {
      entity: true,
    },
    where: {
      entity: {
        id: decoded.entityId,
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  const stats = {
    total: departments.length,
    departments: departments.length,
    entities: new Set(departments.map((d) => d.entityId)).size,
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-none shadow-sm bg-gradient-to-br from-white to-gray-50/50">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary/80" />
              <span className="text-sm font-medium text-muted-foreground">
                Total Áreas
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.total}</div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-gradient-to-br from-white to-gray-50/50">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary/80" />
              <span className="text-sm font-medium text-muted-foreground">
                Departamentos
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {stats.departments}
            </div>
          </CardContent>
        </Card>
      </div>

      <DeparmentsTable departments={departments} />
    </div>
  );
}
