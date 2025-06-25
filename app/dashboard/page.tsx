import { PQRSType } from "@prisma/client";
import prisma from "@/lib/prisma";
import { PQRFilters } from "@/components/filters/pqr-filters";
import { Play } from "lucide-react";
import PQRList from "@/components/pqr/pqrsd-list";
import { Header } from "@/components/Header";
import DashboardSidebar from "@/components/sidebars/UserSidebar";
import EntitiesSidebar from "@/components/sidebars/EntitiesSidebar";

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
    private: false,
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
    where: {
      creatorId: {
        not: null,
      },
      ...where,
    },
    include: {
      creator: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          profilePicture: true,
        },
      },
      comments: {
        select: {
          id: true,
          text: true,
          createdAt: true,
          user: {
            select: {
              firstName: true,
              lastName: true,
              profilePicture: true,
            },
          },
        },
      },
      department: {
        select: {
          name: true,
          entity: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      entity: {
        select: {
          id: true,
          name: true,
        },
      },
      likes: {
        select: {
          id: true,
          userId: true
        },
      },
      customFieldValues: {
        select: {
          name: true,
          value: true,
        },
      },
      attachments: {
        select: {
          name: true,
          url: true,
          type: true,
          size: true,
        },
      }, 
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="w-full">
      <Header/>
      <div className="container mx-auto p-4 mb-6">
        <div className="flex gap-6">
          <div className="hidden lg:block mt-8">
            <EntitiesSidebar />
          </div>
          <div className="flex-1 space-y-6">
            <div className="flex items-center mt-8 gap-2">
              <Play className="h-8 w-8 text-quaternary fill-current" />
              <h1 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-4xl font-bold text-primary">
                La comunidad opina
              </h1>
            </div>
            <PQRFilters entities={entities} departments={departments} />
            <PQRList pqrs={pqrs} />
          </div>
          <div className="hidden lg:block mt-8">
            <DashboardSidebar />
          </div>
        </div>
      </div>
    </div>
  );
}