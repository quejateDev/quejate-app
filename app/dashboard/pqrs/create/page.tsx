import { CategorySelection } from "@/components/pqr/category-selection";
import { Card } from "@/components/ui/card";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
export const dynamic = "force-dynamic";

export default async function CreatePQRPage() {
  // Fetch categories with their entities
  const categories = await prisma.category.findMany({
    where: {
      isActive: true,
    },
    include: {
      entities: {
        select: {
          id: true,
          name: true,
          description: true,
          imageUrl: true,
          municipalityId: true,
          regionalDepartmentId: true,
          isVerified: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  // Function to handle entity selection
  async function handleEntitySelect(entityId: string) {
    "use server";
    redirect(`/dashboard/pqrs/create/${entityId}`);
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="p-6">
        <CategorySelection
          categories={categories}
          onEntitySelect={handleEntitySelect}
        />
      </Card>
    </div>
  );
}
