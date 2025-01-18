import { PQRCard } from "@/components/PQRCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PQRSType } from "@prisma/client";
import prisma from "@/lib/prisma";
import { PQRFilters } from "@/components/filters/pqr-filters";

interface PageProps {
  searchParams: Promise<{
    type?: string;
    status?: string;
    entity?: string;
    department?: string;
  }>;
}

export default async function DashboardPage({ searchParams }: PageProps) {
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

  const { department, entity, type, status } = await searchParams;

  // Build where clause based on search params
  const where: any = {};

  if (type && type !== "all") {
    where.type = type as PQRSType;
  }

  if (status && status !== "all") {
    where.status = status;
  }

  if (entity && entity !== "all") {
    where.department = {
      entityId: entity,
    };
  }

  if (department && department !== "all") {
    where.departmentId = department;
  }

  // Fetch PQRs
  const pqrs = await prisma.pQRS.findMany({
    where,
    include: {
      creator: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
      department: {
        select: {
          name: true,
          entity: {
            select: {
              name: true,
            },
          },
        },
      },
      likes: {
        where: {
          userId: "user-id", // TODO: Replace with actual user ID
        },
        select: {
          id: true,
        },
      },
      customFieldValues: {
        select: {
          name: true,
          value: true,
        },
      },
      attachments: true,
      _count: {
        select: {
          likes: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto p-8">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Mis PQRs</h1>
            <Link href="/dashboard/pqrs/create">
              <Button>Crear PQR</Button>
            </Link>
          </div>

          <PQRFilters entities={entities} departments={departments} />

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
                <p className="text-muted-foreground">
                  No hay PQRS para mostrar
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
