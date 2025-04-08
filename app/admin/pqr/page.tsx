import { PqrVsCategoryChart } from "@/components/charts/pqr/pqr-vs-category";
import PqrVsDepartmentChart from "@/components/charts/pqr/pqr-vs-deparment";
import { PqrVsEntityChart } from "@/components/charts/pqr/pqr-vs-entity";
import { PqrVsTimeChart } from "@/components/charts/pqr/pqr-vs-time";
import { PqrFilters } from "@/components/pqr/pqr-filters";
import PqrTable from "@/components/pqrTable";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/utils";
import { getCookie } from "@/lib/utils";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    categoryId?: string;
    entityId?: string;
    departmentId?: string;
    startDate?: string;
    endDate?: string;
  }>;
}

export default async function PQRPage({ searchParams }: PageProps) {
  const token = await getCookie("token");
  if (!token) {
    return redirect("/login");
  }
  const decoded = await verifyToken(token);
  if (!decoded) {
    return redirect("/login");
  }

  const { departmentId, entityId, categoryId, startDate, endDate } =
    await searchParams;

  // Build the where clause based on filters
  const where: any = {
    department: {
      entityId: decoded.entityId,
    },
  };

  // Add department filter if provided
  if (departmentId) {
    where.departmentId = departmentId;
  }

  // Add entity filter if provided
  if (entityId) {
    where.department = {
      ...where.department,
      entityId: entityId,
    };
  }

  // Add category filter if provided
  if (categoryId) {
    where.department = {
      ...where.department,
      entity: {
        categoryId: categoryId,
      },
    };
  }

  // Add date range filter if provided
  if (startDate || endDate) {
    where.createdAt = {};

    if (startDate) {
      where.createdAt.gte = new Date(startDate);
    }

    if (endDate) {
      // Add one day to include the entire end date
      const endDateObj = new Date(endDate);
      endDateObj.setDate(endDateObj.getDate() + 1);
      where.createdAt.lt = endDateObj;
    }
  }

  const [pqrs, departments] = await Promise.all([
    prisma.pQRS.findMany({
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
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.department.findMany({
      include: {
        entity: true,
      },
      where: {
        entityId: decoded.entityId,
      },
    }),
  ]);

  console.log(`Found ${pqrs.length} PQRs after filtering`);

  return (
    <div className="flex flex-col gap-4">
      <PqrFilters
        departments={departments}
        startDate={startDate ?? null}
        endDate={endDate ?? null}
      />

      <div className="flex flex-row gap-4 w-full">
        <PqrVsTimeChart
          pqrs={pqrs.sort(
            (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
          )}
        />
        {/* <PqrVsEntityChart pqrs={pqrs} /> */}
      </div>

      <div className="flex flex-row gap-4 w-full">
        <PqrVsDepartmentChart pqrs={pqrs} />
        {/* <PqrVsCategoryChart pqrs={pqrs} /> */}
      </div>

      <PqrTable pqrs={pqrs} />
    </div>
  );
}
