import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DeparmentsTable } from "@/components/DeparmentsTable";
import prisma from "@/lib/prisma";
import { getCookie, verifyToken } from "@/lib/utils";
import { redirect } from "next/navigation";
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

  return (
    <div className="">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Áreas Registradas</h1>
        <Link href="/admin/area/create">
          <Button variant={"default"}>Crear Nueva Área</Button>
        </Link>
      </div>

      <div className="rounded-md border">
        <DeparmentsTable departments={departments} />
      </div>
    </div>
  );
}
