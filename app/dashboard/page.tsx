import { Button } from "@/components/ui/button";
import { PQRCard } from "@/components/PQRCard";
import Link from "next/link";
import { Prisma, PQRSType } from "@prisma/client";
import prisma from "@/lib/prisma";
import { PQRFilters } from "@/components/filters/pqr-filters";

interface PageProps {
  searchParams: {
    type?: string;
    sort?: string;
    entity?: string;
    department?: string;
  };
}

export default async function PQRS({ searchParams }: PageProps) {
  // Fetch entities and departments for filters
  const entities = await prisma.entity.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  const departments = await prisma.department.findMany({
    select: {
      id: true,
      name: true,
      entityId: true,
    },
  });
  
  const where: Prisma.PQRSWhereInput = {};
  
  if (searchParams.type && searchParams.type !== "all") {
    where.type = searchParams.type as PQRSType;
  }
  
  if (searchParams.entity && searchParams.entity !== "all") {
    where.department = {
      entityId: searchParams.entity,
    };
  }
  
  if (searchParams.department && searchParams.department !== "all") {
    where.departmentId = searchParams.department;
  }

  // Determine sort order
  let orderBy: any = { createdAt: "desc" };
  if (searchParams.sort === "date-asc") {
    orderBy = { createdAt: "asc" };
  } else if (searchParams.sort === "likes-desc") {
    orderBy = {
      likes: {
        _count: "desc",
      },
    };
  }

  const pqrs = await prisma.pQRS.findMany({
    where,
    orderBy,
    include: {
      department: {
        include: {
          entity: true,
        },
      },
      customFieldValues: true,
      _count: {
        select: {
          likes: true,
        },
      },
      likes: true,
      creator: true,
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto p-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">
              PQRS Recientes
            </h1>
            <Link href="/dashboard/pqrs/new">
              <Button>Crear PQRS</Button>
            </Link>
          </div>

          <PQRFilters 
            entities={entities}
            departments={departments}
          />

          <div className="space-y-6">
            {pqrs.map((pqr) => (
              <PQRCard 
                key={pqr.id} 
                pqr={pqr} 
                initialLiked={pqr.likes?.length > 0}
              />
            ))}
            {pqrs.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No hay PQRS para mostrar</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
