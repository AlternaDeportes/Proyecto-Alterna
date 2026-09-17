"use client";

import dynamic from "next/dynamic";
import type { DeporteListItem } from "@/modules/deportes/types";
import type { MapUbicacion } from "@/modules/mapa/types";

const MapExplorer = dynamic(
  () =>
    import("@/modules/mapa/components/MapExplorer").then((m) => m.MapExplorer),
  {
    ssr: false,
    loading: () => (
      <div className="flex aspect-square w-full max-w-[38rem] items-center justify-center rounded-frame border border-brand-ink/10 bg-brand-surface text-brand-ink/60">
        Cargando mapa…
      </div>
    ),
  }
);

interface MapPageClientProps {
  ubicaciones: MapUbicacion[];
  deportes: DeporteListItem[];
  deporteInicial?: string;
}

export function MapPageClient({
  ubicaciones,
  deportes,
  deporteInicial,
}: MapPageClientProps) {
  return (
    <MapExplorer
      ubicaciones={ubicaciones}
      deportes={deportes}
      deporteInicial={deporteInicial}
    />
  );
}
