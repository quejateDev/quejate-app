import { Button } from "@/components/ui/button";
import { EntitiesTable } from "@/components/EntitiesTable";
import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function EntitiesPage() {
  const entities = await prisma.entity.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      category: {
        select: {
          name: true,
        },
      },
    },
  });

  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Entidades</h1>
        <Link href="/admin/entity/create">
          <Button>Crear Entidad</Button>
        </Link>
      </div>
      <EntitiesTable entities={entities} categories={categories} />
    </div>
  );
}
