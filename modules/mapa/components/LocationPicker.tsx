"use client";

import dynamic from "next/dynamic";
import type { MapPunto } from "@/modules/mapa/components/LocationPickerMap";

const LocationPickerMap = dynamic(
  () =>
    import("@/modules/mapa/components/LocationPickerMap").then(
      (m) => m.LocationPickerMap
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center bg-white text-sm text-brand-ink/50">
        Cargando mapa…
      </div>
    ),
  }
);

interface LocationPickerProps {
  cityCenter: MapPunto;
  value: MapPunto | null;
  onChange: (punto: MapPunto) => void;
}

export function LocationPicker({ cityCenter, value, onChange }: LocationPickerProps) {
  return (
    <LocationPickerMap cityCenter={cityCenter} value={value} onChange={onChange} />
  );
}
