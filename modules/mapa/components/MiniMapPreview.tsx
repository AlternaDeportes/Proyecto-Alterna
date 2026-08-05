"use client";

import { useMemo } from "react";
import { MapContainer, TileLayer, Marker, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { designTokens } from "@/config/design-tokens";
import { colorDeporteMapa, MAP_REGION } from "@/config/map-region";
import type { MapUbicacion } from "@/modules/mapa/types";
import { crearIconoDeporte } from "@/modules/mapa/utils/map-icons";

interface MiniMapPreviewProps {
  ubicaciones: MapUbicacion[];
}

/**
 * Vista previa no interactiva del mapa — invita a entrar a /mapa.
 */
export function MiniMapPreview({ ubicaciones }: MiniMapPreviewProps) {
  const center: [number, number] = [MAP_REGION.center.lat, MAP_REGION.center.lng];
  const puntos = useMemo(() => ubicaciones.slice(0, 10), [ubicaciones]);

  return (
    <MapContainer
      center={center}
      zoom={11}
      className="h-full w-full"
      zoomControl={false}
      attributionControl={false}
      dragging={false}
      doubleClickZoom={false}
      scrollWheelZoom={false}
      boxZoom={false}
      keyboard={false}
      touchZoom={false}
      aria-hidden
    >
      <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
      <Circle
        center={center}
        radius={MAP_REGION.radiusKm * 1000}
        pathOptions={{
          color: designTokens.colors.primary,
          weight: 1,
          fillColor: designTokens.colors.primary,
          fillOpacity: 0.06,
        }}
      />
      {puntos.map((u) => (
        <Marker
          key={u.id}
          position={[u.lat, u.lng]}
          icon={crearIconoDeporte(
            colorDeporteMapa(u.deporte.slug, u.deporte.colorPrimario)
          )}
          interactive={false}
        />
      ))}
    </MapContainer>
  );
}
