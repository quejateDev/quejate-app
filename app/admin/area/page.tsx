import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getDepartmentsService } from "@/services/api/Department.service";
import { DeparmentsTable } from "@/components/DeparmentsTable";

export default async function AreasPage() {
  const departments = await getDepartmentsService();

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Áreas Registradas</h1>
        <Link href="/admin/area/create">
          <Button className="bg-green-500 hover:bg-green-600">
            Crear Nueva Área
          </Button>
        </Link>
      </div>

      <div className="rounded-md border">
        <DeparmentsTable departments={departments} />
      </div>
    </div>
  );
}
