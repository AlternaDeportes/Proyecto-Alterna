"use client";

import dynamic from "next/dynamic";
import type { MapUbicacion } from "@/modules/mapa/types";

const MapExplorer = dynamic(
  () =>
    import("@/modules/mapa/components/MapExplorer").then((m) => m.MapExplorer),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center bg-brand-ink text-white/70">
        Cargando mapa…
      </div>
    ),
  }
);

interface MapPageClientProps {
  ubicaciones: MapUbicacion[];
  deporteInicial?: string;
}

export function MapPageClient({ ubicaciones, deporteInicial }: MapPageClientProps) {
  return <MapExplorer ubicaciones={ubicaciones} deporteInicial={deporteInicial} />;
}
