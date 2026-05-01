import prisma from "@/lib/prisma";
import MapaWrapper from "./MapaWrapper";
import { MapPin } from "lucide-react";

export default async function MapaPage() {
  const reportes = await prisma.pQRS.findMany({
    where: {
      latitude: { not: null },
      longitude: { not: null },
      private: false,
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-100 p-2 rounded-lg">
              <MapPin className="h-6 w-6 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Mapa Ciudadano</h1>
          </div>
          <p className="text-gray-500 ml-14">
            Visualiza los reportes públicos registrados en tu ciudad
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
            <p className="text-sm text-gray-500">Total de reportes</p>
            <p className="text-2xl font-bold text-gray-900">{reportes.length}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
            <p className="text-sm text-gray-500">Con ubicación</p>
            <p className="text-2xl font-bold text-blue-600">{reportes.length}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
            <p className="text-sm text-gray-500">Entidades</p>
            <p className="text-2xl font-bold text-gray-900">
              {new Set(reportes.map(r => r.entity?.name).filter(Boolean)).size}
            </p>
          </div>
        </div>

        {/* Mapa */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Reportes en el mapa</h2>
            <p className="text-sm text-gray-500">Usa los filtros para encontrar reportes específicos</p>
          </div>
          <div className="p-4">
            <MapaWrapper reportes={reportes} />
          </div>
        </div>

      </div>
    </div>
  );
}