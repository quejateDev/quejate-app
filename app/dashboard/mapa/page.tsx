import prisma from "@/lib/prisma";
import MapaWrapper from "./MapaWrapper";

export default async function MapaPage() {
  const reportes = await prisma.pQRS.findMany({
    where: {
      latitude: { not: null },
      longitude: { not: null },
    },
    select: {
      id: true,
      subject: true,
      type: true,
      status: true,
      latitude: true,
      longitude: true,
      createdAt: true,
      entity: {
        select: {
          name: true,
        },
      },
    },
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Mapa Ciudadano</h1>
      <p className="text-gray-500 mb-4">
        Reportes públicos con ubicación registrada.
      </p>
      <MapaWrapper reportes={reportes} />
    </div>
  );
}