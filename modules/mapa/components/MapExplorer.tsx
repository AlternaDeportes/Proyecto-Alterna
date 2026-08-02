"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { designTokens } from "@/config/design-tokens";
import { distanciaKm } from "@/lib/geo";
import { MapFilters } from "@/modules/mapa/components/MapFilters";
import { LocationPanel } from "@/modules/mapa/components/LocationPanel";
import {
  SANTA_FE_CENTER,
  type FiltroDeporteSlug,
  type MapUbicacion,
} from "@/modules/mapa/types";
import { crearIconoDeporte, iconoUsuario } from "@/modules/mapa/utils/map-icons";

interface MapExplorerProps {
  ubicaciones: MapUbicacion[];
  deporteInicial?: string;
}

function MapController({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [center, zoom, map]);
  return null;
}

export function MapExplorer({ ubicaciones, deporteInicial }: MapExplorerProps) {
  const filtroInicial: FiltroDeporteSlug =
    deporteInicial === "ultimate-frisbee" ||
    deporteInicial === "newcom" ||
    deporteInicial === "wingfoil"
      ? deporteInicial
      : "todos";

  const [filtro, setFiltro] = useState<FiltroDeporteSlug>(filtroInicial);
  const [radioKm, setRadioKm] = useState(12);
  const [posicionUsuario, setPosicionUsuario] = useState(SANTA_FE_CENTER);
  const [seleccionada, setSeleccionada] = useState<MapUbicacion | null>(null);
  const [panelAbierto, setPanelAbierto] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosicionUsuario({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => {
        /* mantiene centro Santa Fe */
      },
      { enableHighAccuracy: true, timeout: 9000 }
    );
  }, []);

  const visibles = useMemo(() => {
    return ubicaciones.filter((u) => {
      const okDeporte = filtro === "todos" || u.deporte.slug === filtro;
      const okRadio = distanciaKm(posicionUsuario, u) <= radioKm;
      return okDeporte && okRadio;
    });
  }, [ubicaciones, filtro, radioKm, posicionUsuario]);

  const seleccionar = useCallback((u: MapUbicacion) => {
    setSeleccionada(u);
    setPanelAbierto(true);
  }, []);

  const mapCenter: [number, number] = [posicionUsuario.lat, posicionUsuario.lng];

  return (
    <div className="flex h-full flex-col bg-brand-ink">
      <MapFilters
        filtro={filtro}
        radioKm={radioKm}
        total={visibles.length}
        onFiltroChange={setFiltro}
        onRadioChange={setRadioKm}
      />

      <div className="relative min-h-0 flex-1">
        <MapContainer
          center={mapCenter}
          zoom={13}
          className="h-full w-full z-0"
          scrollWheelZoom
          aria-label="Mapa de actividades deportivas en Santa Fe"
        >
          <MapController center={mapCenter} zoom={13} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; CARTO'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
          <Circle
            center={mapCenter}
            radius={radioKm * 1000}
            pathOptions={{
              color: designTokens.colors.primary,
              weight: 2,
              fillColor: designTokens.colors.primary,
              fillOpacity: 0.08,
            }}
          />
          <Marker position={mapCenter} icon={iconoUsuario}>
            <Popup>Tu ubicación</Popup>
          </Marker>
          {visibles.map((u) => (
            <Marker
              key={u.id}
              position={[u.lat, u.lng]}
              icon={crearIconoDeporte(u.deporte.colorPrimario)}
              eventHandlers={{
                click: () => seleccionar(u),
              }}
            >
              <Popup>
                <strong>{u.deporte.nombre}</strong>
                <br />
                {u.nombre}
                <br />
                <small>{u.horarios}</small>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        <LocationPanel
          ubicaciones={visibles}
          seleccionada={seleccionada}
          posicionUsuario={posicionUsuario}
          abierto={panelAbierto}
          onToggle={() => setPanelAbierto((v) => !v)}
          onSeleccionar={seleccionar}
        />
      </div>
    </div>
  );
}
