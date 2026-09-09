import { CategorySelection } from "@/components/pqr/category-selection";
import { Card } from "@/components/ui/card";
import { backendJson } from "@/lib/api/backend";
import { redirect } from "next/navigation";
export const dynamic = "force-dynamic";

/** Una entidad tal como la sirve `GET /category`: los campos del selector. */
interface CategoryEntity {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  municipalityId: string | null;
  regionalDepartmentId: string | null;
  isVerified: boolean;
}

/**
 * Un elemento de `GET /category`. El backend devuelve además `isActive`,
 * `createdAt` y `updatedAt`; no se declaran porque el selector no los pinta y
 * declararlos obligaría a decidir si las fechas son `string` o `Date`.
 */
interface CategoryWithEntities {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  entities: CategoryEntity[];
}

export default async function CreatePQRPage() {
  // B-09: esta página leía Prisma directamente. El `where: { isActive: true }`
  // que aplicaba sobre las entidades vive ahora en el backend
  // (`categories.service.ts`), donde lo comparten todos los clientes, en vez de
  // depender de que cada página se acuerde de escribirlo.
  //
  // Si el backend falla, la excepción sube y la página no se pinta. Es
  // deliberado: un selector de entidad a medias haría creer al ciudadano que su
  // entidad no está registrada, y acabaría radicando contra otra.
  const categories = await backendJson<CategoryWithEntities[]>("/category");

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
