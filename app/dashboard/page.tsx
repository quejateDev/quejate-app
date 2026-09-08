import { Play } from "lucide-react";
import PQRList from "@/components/pqr/pqrsd-list";
import { Header } from "@/components/Header";
import EntitiesSidebar from "@/components/sidebars/EntitiesSidebar";
import UserSidebar from "@/components/sidebars/UserSidebar";
import { getFullUserWithFollowingStatus, getUsersForSidebar } from "@/data/user";
import { currentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { hideAnonymousCreator } from "@/lib/pqr-anonymity";

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

  const { topUsers, discoverUsers } = await getUsersForSidebar(fullUser?.id);

  const initialPqrs = await prisma.pQRS.findMany({
    where: {
      private: false,
      creatorId: { not: null }
    },
    include: {
      creator: {
        select: {
          id: true,
          name: true,
          image: true,
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
    take: 10,
  });

  // H-18: el muro es público y sin sesión. Sin esto, el nombre y la foto de
  // quien radicó una PQRSD anónima viajan al navegador dentro de los props de
  // `PQRList`, que es un componente de cliente. La tarjeta escribe «Anónimo»
  // (`PQRCardHeader.tsx:112`), pero el dato sale igual en la carga de la
  // página. El backend ya lo aplica en `GET /pqr` desde el 04/09/2026; esta
  // página no pasa por ahí.
  const visiblePqrs = initialPqrs.map((pqr) =>
    hideAnonymousCreator(pqr, fullUser?.id),
  );

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
              initialPqrs={visiblePqrs} 
              currentUser={fullUser || null}
            />
          </div>
          <div className="hidden lg:block mt-8">
            <UserSidebar
              initialTopUsers={topUsers}
              initialDiscoverUsers={discoverUsers}
            />
          </div>
        </div>
      </div>
    </div>
  );
}