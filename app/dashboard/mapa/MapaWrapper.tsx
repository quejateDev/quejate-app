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
  createdAt: Date;
  entity: { name: string } | null;
};

export default function MapaWrapper({ reportes }: { reportes: Reporte[] }) {
  return <MapaCiudadano reportes={reportes} />;
}