"use client";
import dynamic from "next/dynamic";

const MapaCiudadano = dynamic(
  () => import("@/components/mapa-ciudadano/MapaCiudadano"),
  {
    ssr: false,
    loading: () => <p>Cargando mapa...</p>,
  }
);

export type Reporte = {
  id: string;
  subject: string | null;
  type: string;
  status: string;
  latitude: number | null;
  longitude: number | null;
  // Texto ISO: llega por HTTP desde `GET /pqr/map`, no como `Date` de Prisma.
  // `MapaCiudadano` la envuelve siempre en `new Date(...)` antes de usarla.
  createdAt: string;
  entity: { name: string } | null;
  creator: { name: string | null; image: string | null } | null;
  anonymous: boolean;
};

export default function MapaWrapper({ reportes }: { reportes: Reporte[] }) {
  return <MapaCiudadano reportes={reportes} />;
}