"use client";

import { useEffect } from "react";
import {
  Circle,
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { designTokens } from "@/config/design-tokens";
import { MAP_REGION } from "@/config/map-region";
import { MAP_TILES } from "@/config/map-tiles";
import { iconoPicker } from "@/modules/mapa/utils/map-icons";

export interface MapPunto {
  lat: number;
  lng: number;
}

interface LocationPickerMapProps {
  cityCenter: MapPunto;
  value: MapPunto | null;
  onChange: (punto: MapPunto) => void;
}

function ClickToMark({ onChange }: { onChange: (punto: MapPunto) => void }) {
  useMapEvents({
    click(event) {
      onChange({ lat: event.latlng.lat, lng: event.latlng.lng });
    },
  });
  return null;
}

function FollowCity({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], 13, { duration: 0.55 });
  }, [lat, lng, map]);
  return null;
}

function FixSize() {
  const map = useMap();
  useEffect(() => {
    const id = window.setTimeout(() => map.invalidateSize(), 120);
    return () => window.clearTimeout(id);
  }, [map]);
  return null;
}

export function LocationPickerMap({
  cityCenter,
  value,
  onChange,
}: LocationPickerMapProps) {
  const center: [number, number] = [cityCenter.lat, cityCenter.lng];

  return (
    <MapContainer
      center={center}
      zoom={13}
      className="alterna-map h-full w-full cursor-crosshair"
      scrollWheelZoom
      aria-label="Marcá el lugar en el mapa"
    >
      <FixSize />
      <FollowCity lat={cityCenter.lat} lng={cityCenter.lng} />
      <ClickToMark onChange={onChange} />
      <TileLayer
        attribution={MAP_TILES.attribution}
        url={MAP_TILES.url}
        maxZoom={MAP_TILES.maxZoom}
        subdomains={MAP_TILES.subdomains}
      />
      <Circle
        center={[MAP_REGION.center.lat, MAP_REGION.center.lng]}
        radius={MAP_REGION.radiusKm * 1000}
        pathOptions={{
          color: designTokens.colors.primary,
          weight: 1.5,
          fillColor: designTokens.colors.primary,
          fillOpacity: 0.05,
        }}
      />
      {value ? (
        <Marker position={[value.lat, value.lng]} icon={iconoPicker} />
      ) : null}
    </MapContainer>
  );
}
