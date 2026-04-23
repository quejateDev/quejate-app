"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useState } from "react";
import type { Reporte } from "@/app/dashboard/mapa/MapaWrapper";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  iconUrl: "/leaflet/marker-icon.png",
  shadowUrl: "/leaflet/marker-shadow.png",
});

const TIPOS = ["TODOS", "PETITION", "COMPLAINT", "CLAIM", "SUGGESTION", "REPORT"];
const ESTADOS = ["TODOS", "PENDING", "IN_PROGRESS", "RESOLVED", "REJECTED"];
const TIPO_LABELS: Record<string, string> = {
  PETITION: "Petición",
  COMPLAINT: "Queja",
  CLAIM: "Reclamo",
  SUGGESTION: "Sugerencia",
  REPORT: "Denuncia",
};
const ESTADO_LABELS: Record<string, string> = {
  PENDING: "Pendiente",
  IN_PROGRESS: "En progreso",
  RESOLVED: "Resuelto",
  REJECTED: "Rechazado",
};

export default function MapaCiudadano({ reportes }: { reportes: Reporte[] }) {
  const [tipo, setTipo] = useState("TODOS");
  const [estado, setEstado] = useState("TODOS");
  const [ciudad, setCiudad] = useState("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");

  const reportesFiltrados = reportes
    .filter((r) => r.latitude && r.longitude)
    .filter((r) => tipo === "TODOS" || r.type === tipo)
    .filter((r) => estado === "TODOS" || r.status === estado)
    .filter((r) =>
      ciudad === "" ||
      r.entity?.name?.toLowerCase().includes(ciudad.toLowerCase())
    )
    .filter((r) => {
      if (!fechaDesde) return true;
      return new Date(r.createdAt) >= new Date(fechaDesde);
    })
    .filter((r) => {
      if (!fechaHasta) return true;
      return new Date(r.createdAt) <= new Date(fechaHasta);
    });

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
        
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600">Entidad / Ciudad</label>
          <input
            type="text"
            placeholder="Buscar entidad..."
            value={ciudad}
            onChange={(e) => setCiudad(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600">Tipo</label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            {TIPOS.map((t) => (
              <option key={t} value={t}>
                {t === "TODOS" ? "Todos los tipos" : TIPO_LABELS[t]}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600">Estado</label>
          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            {ESTADOS.map((e) => (
              <option key={e} value={e}>
                {e === "TODOS" ? "Todos los estados" : ESTADO_LABELS[e]}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600">Fecha desde</label>
          <input
            type="date"
            value={fechaDesde}
            onChange={(e) => setFechaDesde(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600">Fecha hasta</label>
          <input
            type="date"
            value={fechaHasta}
            onChange={(e) => setFechaHasta(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
        </div>

        <div className="flex items-end">
          <button
            onClick={() => {
              setTipo("TODOS");
              setEstado("TODOS");
              setCiudad("");
              setFechaDesde("");
              setFechaHasta("");
            }}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm hover:bg-gray-50"
          >
            Limpiar filtros
          </button>
        </div>

        <div className="flex items-end col-span-2 md:col-span-1">
          <span className="text-sm text-gray-500">
            {reportesFiltrados.length} reporte{reportesFiltrados.length !== 1 ? "s" : ""} encontrado{reportesFiltrados.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Mapa */}
      <MapContainer
        center={[4.711, -74.0721]}
        zoom={6}
        style={{ height: "550px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap"
        />
        {reportesFiltrados.map((reporte) => (
          <Marker
            key={reporte.id}
            position={[reporte.latitude as number, reporte.longitude as number]}
          >
            <Popup>
              <strong>{reporte.subject}</strong>
              <br />
              Tipo: {TIPO_LABELS[reporte.type] || reporte.type}
              <br />
              Estado: {ESTADO_LABELS[reporte.status] || reporte.status}
              <br />
              Entidad: {reporte.entity?.name || "N/A"}
              <br />
              Fecha: {new Date(reporte.createdAt).toLocaleDateString("es-CO")}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}