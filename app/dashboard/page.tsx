import { Play } from "lucide-react";
import PQRList from "@/components/pqr/pqrsd-list";
import { Header } from "@/components/Header";
import EntitiesSidebar from "@/components/sidebars/EntitiesSidebar";
import UserSidebar from "@/components/sidebars/UserSidebar";
import { getFullUserWithFollowingStatus } from "@/data/user";
import { backendJson } from "@/lib/api/backend";
import { currentUser } from "@/lib/auth";
import type { PQR } from "@/types/pqrsd";
import type { SidebarUser } from "@/types/sidebar-user";

/** Lo que esta página lee de `GET /pqr`: la primera página del muro. */
interface WallPage {
  pqrs: PQR[];
}

/** Respuesta de `GET /users/sidebar`. */
interface SidebarUsers {
  topUsers: SidebarUser[];
  discoverUsers: SidebarUser[];
}

interface PageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
  }>;
}

interface PageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
  }>;
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const sessionUser = await currentUser();
  const fullUser = sessionUser
    ? await getFullUserWithFollowingStatus(sessionUser.id!)
    : null;

  // B-09: esta página leía Prisma para la lista y para la barra lateral. Ahora
  // las dos salen del backend, que es donde se decide qué se ve:
  //
  // - La lista, de `GET /pqr` — la MISMA ruta de la que `PQRList` ya pedía la
  //   página 2 en adelante. Antes la página 1 salía de Prisma y las siguientes
  //   del backend, así que las dos podían no coincidir. El anonimato (H-18) lo
  //   aplica el backend, con la excepción del propio autor: por eso se reenvía
  //   la sesión.
  // - La barra lateral, de `GET /users/sidebar`: cinco campos por usuario.
  //   Aquí vivía H-24 — filas completas, hash de la contraseña incluido, en una
  //   página pública.
  //
  // El usuario de la sesión (`fullUser`) sigue saliendo de `data/user.ts`: es
  // el perfil de quien mira, el mismo que ya lee el layout para todo
  // `/dashboard`, no datos de terceros.
  const wallRequest = backendJson<WallPage>("/pqr", {
    searchParams: { page: "1", limit: "10" },
  });

  // Si la barra lateral falla, se pinta vacía y queda aviso en los logs: una
  // barra lateral ausente se ve incompleta, no engaña. La lista, en cambio, NO
  // se captura — un muro vacío diría que no hay PQRSD, y eso sí sería mentir.
  const sidebarRequest = backendJson<SidebarUsers>("/users/sidebar").catch(
    (error: unknown) => {
      console.warn("[muro] la barra lateral no cargó; se pinta vacía:", error);
      return { topUsers: [], discoverUsers: [] } satisfies SidebarUsers;
    },
  );

  const [wall, sidebar] = await Promise.all([wallRequest, sidebarRequest]);

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
            <PQRList 
              initialPqrs={wall.pqrs}
              currentUser={fullUser || null}
            />
          </div>
          <div className="hidden lg:block mt-8">
            <UserSidebar
              initialTopUsers={sidebar.topUsers}
              initialDiscoverUsers={sidebar.discoverUsers}
            />
          </div>
        </div>
      </div>
    </div>
  );
}