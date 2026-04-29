"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useState } from "react";
import { Search, Filter, X, MapPin } from "lucide-react";
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

const ESTADO_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  IN_PROGRESS: "bg-blue-100 text-blue-800",
  RESOLVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
};

const TIPO_COLORS: Record<string, string> = {
  PETITION: "bg-purple-100 text-purple-800",
  COMPLAINT: "bg-red-100 text-red-800",
  CLAIM: "bg-orange-100 text-orange-800",
  SUGGESTION: "bg-green-100 text-green-800",
  REPORT: "bg-gray-100 text-gray-800",
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

  const hayFiltrosActivos = tipo !== "TODOS" || estado !== "TODOS" || ciudad !== "" || fechaDesde !== "" || fechaHasta !== "";

  const limpiarFiltros = () => {
    setTipo("TODOS");
    setEstado("TODOS");
    setCiudad("");
    setFechaDesde("");
    setFechaHasta("");
  };

  return (
    <div className="space-y-4">

      {/* Filtros */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filtros</span>
          {hayFiltrosActivos && (
            <button
              onClick={limpiarFiltros}
              className="ml-auto flex items-center gap-1 text-xs text-red-500 hover:text-red-700"
            >
              <X className="h-3 w-3" />
              Limpiar filtros
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          
          {/* Entidad */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">Entidad</label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-3.5 w-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar..."
                value={ciudad}
                onChange={(e) => setCiudad(e.target.value)}
                className="w-full border border-gray-300 rounded-md pl-7 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Tipo */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">Tipo</label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              {TIPOS.map((t) => (
                <option key={t} value={t}>
                  {t === "TODOS" ? "Todos los tipos" : TIPO_LABELS[t]}
                </option>
              ))}
            </select>
          </div>

          {/* Estado */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">Estado</label>
            <select
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              {ESTADOS.map((e) => (
                <option key={e} value={e}>
                  {e === "TODOS" ? "Todos los estados" : ESTADO_LABELS[e]}
                </option>
              ))}
            </select>
          </div>

          {/* Fecha desde */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">Desde</label>
            <input
              type="date"
              value={fechaDesde}
              onChange={(e) => setFechaDesde(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            />
          </div>

          {/* Fecha hasta */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">Hasta</label>
            <input
              type="date"
              value={fechaHasta}
              onChange={(e) => setFechaHasta(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            />
          </div>

        </div>

        {/* Contador */}
        <div className="mt-3 flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5 text-blue-500" />
          <span className="text-xs text-gray-500">
            <span className="font-semibold text-blue-600">{reportesFiltrados.length}</span>{" "}
            reporte{reportesFiltrados.length !== 1 ? "s" : ""} encontrado{reportesFiltrados.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Mapa */}
      <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
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
                <div className="min-w-[180px]">
                  <p className="font-semibold text-gray-900 mb-2">{reporte.subject}</p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TIPO_COLORS[reporte.type]}`}>
                      {TIPO_LABELS[reporte.type] || reporte.type}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ESTADO_COLORS[reporte.status]}`}>
                      {ESTADO_LABELS[reporte.status] || reporte.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">🏢 {reporte.entity?.name || "N/A"}</p>
                  <p className="text-xs text-gray-500">📅 {new Date(reporte.createdAt).toLocaleDateString("es-CO")}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

    </div>
  );
}