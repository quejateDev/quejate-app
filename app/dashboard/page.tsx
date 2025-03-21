import { PQRCard } from "@/components/pqr/PQRCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PQRSType } from "@prisma/client";
import prisma from "@/lib/prisma";
import { PQRFilters } from "@/components/filters/pqr-filters";
import { PlusIcon } from "lucide-react";

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
  const where: any = {
    private: false
  };

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
          <div className="bg-primary/10 p-4 rounded-lg">
            <div className="container mx-auto flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div>
                <h2 className="font-semibold">¿Tienes alguna petición, queja, reclamo, sugerencia o denuncia?</h2>
                <p className="text-sm text-muted-foreground">Crea y envía tu PQRSD fácilmente a través de nuestra plataforma.</p>
              </div>
              <Link href="/dashboard/pqrs/create">
                <Button className="bg-primary hover:bg-primary/90 flex items-center gap-2">
                  <PlusIcon className="h-4 w-4" />
                  <span>Crear PQRSD</span>
                </Button>
              </Link>
            </div>
          </div>

          <PQRFilters entities={entities} departments={departments} />

          <div className="space-y-6">
            {pqrs.map((pqr) => (
              <PQRCard
                key={pqr.id}
                pqr={{ ...pqr, dueDate: pqr.dueDate.toISOString() }}
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
