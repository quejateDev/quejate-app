import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getEntities } from "@/services/api/entity.service";
import { EntitiesTable } from "@/components/EntitiesTable";

export default async function EntitiesPage() {
  const entities = await getEntities();

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Entidades Registradas</h1>
        <Link href="/dashboard/entity/create">
          <Button className="bg-green-500 hover:bg-green-600">
            Crear Nueva Entidad
          </Button>
        </Link>
      </div>

      <div className="rounded-md border">
        <EntitiesTable entities={entities} />
      </div>
    </div>
  );
}
