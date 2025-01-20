import { PqrVsCategoryChart } from "@/components/charts/pqr/pqr-vs-category";
import PqrVsDepartmentChart from "@/components/charts/pqr/pqr-vs-deparment";
import { PqrVsEntityChart } from "@/components/charts/pqr/pqr-vs-entity";
import { PqrVsTimeChart } from "@/components/charts/pqr/pqr-vs-time";
import { PqrFilters } from "@/components/pqr/pqr-filters";
import PqrTable from "@/components/pqrTable";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

interface Entity {
  id: string;
  name: string;
  category: {
    id: string;
    name: string;
  };
  departments: {
    id: string;
    name: string;
  }[];
}

interface RawEntity {
  id: string;
  name: string;
  category: {
    name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    description: string | null;
    imageUrl: string | null;
  };
  Department: {
    name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    description: string | null;
    entityId: string;
  }[];
}

interface PageProps {
  searchParams: Promise<{
    categoryId?: string;
    entityId?: string;
    departmentId?: string;
  }>;
}

export default async function PQRPage({ searchParams }: PageProps) {
  // First, get all entities for the filters
  const categories = await prisma.category.findMany({
    include: {
      entities: {
        include: {
          Department: true,
        },
      },
    },
  });

  const { departmentId, entityId, categoryId } = await searchParams;
  // Build the where clause based on filters
  const where = {
    ...(departmentId && {
      departmentId: departmentId,
    }),
    ...(entityId && {
      department: {
        entityId: entityId,
      },
    }),
    ...(categoryId && {
      department: {
        entity: {
          categoryId: categoryId,
        },
      },
    }),
  };

  const pqrs = await prisma.pQRS.findMany({
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
  });

  return (
    <div className="flex flex-col gap-4">
      <PqrFilters categories={categories} />

      <div className="flex flex-row gap-4 w-full">
        <PqrVsTimeChart pqrs={pqrs} />
        <PqrVsEntityChart pqrs={pqrs} />
      </div>

      <div className="flex flex-row gap-4 w-full">
        <PqrVsCategoryChart pqrs={pqrs} />
        <PqrVsDepartmentChart pqrs={pqrs} />
      </div>

      <PqrTable pqrs={pqrs} />
    </div>
  );
}
