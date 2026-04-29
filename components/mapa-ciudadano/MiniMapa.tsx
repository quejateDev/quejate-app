"use client";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useState } from "react";
import { MapPin, Loader2, Navigation } from "lucide-react";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  iconUrl: "/leaflet/marker-icon.png",
  shadowUrl: "/leaflet/marker-shadow.png",
});

type Props = {
  onLocationSelect: (lat: number, lng: number) => void;
};

function ClickHandler({ onLocationSelect }: Props) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function MiniMapa({ onLocationSelect }: Props) {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [map, setMap] = useState<L.Map | null>(null);
  const [direccion, setDireccion] = useState<string | null>(null);
  const [loadingDireccion, setLoadingDireccion] = useState(false);

  const obtenerDireccion = async (lat: number, lng: number) => {
    setLoadingDireccion(true);
    setDireccion(null);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=es`,
        { headers: { "Accept-Language": "es" } }
      );
      const data = await response.json();
      if (data.display_name) {
        setDireccion(data.display_name);
      }
    } catch {
      setDireccion("No se pudo obtener la dirección");
    } finally {
      setLoadingDireccion(false);
    }
  };

  const handleClick = (lat: number, lng: number) => {
    setPosition([lat, lng]);
    onLocationSelect(lat, lng);
    obtenerDireccion(lat, lng);
  };

  const handleGoToMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Tu navegador no soporta geolocalización");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setPosition([lat, lng]);
        onLocationSelect(lat, lng);
        obtenerDireccion(lat, lng);
        map?.flyTo([lat, lng], 15);
      },
      () => {
        alert("No se pudo obtener la ubicación. Verifica los permisos.");
      }
    );
  };

  return (
    <div className="flex flex-col gap-2">
      
      {/* Header del minimapa */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Haz clic en el mapa para seleccionar la ubicación
        </p>
        <button
          type="button"
          onClick={handleGoToMyLocation}
          className="flex items-center gap-1.5 text-sm bg-blue-50 text-blue-600 border border-blue-200 rounded-md px-3 py-1.5 hover:bg-blue-100 transition-colors"
        >
          <Navigation className="h-3.5 w-3.5" />
          Ir a mi ubicación
        </button>
      </div>

      {/* Mapa */}
      <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
        <MapContainer
          center={[4.711, -74.0721]}
          zoom={6}
          style={{ height: "300px", width: "100%" }}
          ref={setMap}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap"
          />
          <ClickHandler onLocationSelect={handleClick} />
          {position && <Marker position={position} />}
        </MapContainer>
      </div>

      {/* Dirección */}
      {loadingDireccion && (
        <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 border border-gray-200 rounded-md px-3 py-2">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Obteniendo dirección...
        </div>
      )}

      {direccion && !loadingDireccion && (
        <div className="flex items-start gap-2 bg-green-50 border border-green-200 rounded-md px-3 py-2">
          <MapPin className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-medium text-green-700">Ubicación seleccionada</p>
            <p className="text-xs text-green-600 mt-0.5">{direccion}</p>
          </div>
        </div>
      )}

    </div>
  );
}