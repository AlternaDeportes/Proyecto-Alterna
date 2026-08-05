"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import type { MapUbicacion } from "@/modules/mapa/types";

const MiniMapPreview = dynamic(
  () =>
    import("@/modules/mapa/components/MiniMapPreview").then((m) => m.MiniMapPreview),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center bg-brand-ink/[0.03] text-sm text-brand-ink/50">
        Cargando vista del mapa…
      </div>
    ),
  }
);

interface MiniMapTeaserProps {
  ubicaciones: MapUbicacion[];
}

/**
 * Wrapper client del minimapa (dynamic + ssr:false no puede vivir en Server Components).
 */
export function MiniMapTeaser({ ubicaciones }: MiniMapTeaserProps) {
  return (
    <Link
      href="/mapa"
      className="group relative mt-10 block overflow-hidden rounded-frame border border-brand-ink/10 shadow-lift focus-ring"
    >
      <div className="pointer-events-none aspect-[16/11] min-h-[280px] sm:min-h-[360px] lg:aspect-[21/10]">
        <MiniMapPreview ubicaciones={ubicaciones} />
      </div>
      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-brand-ink/80 via-brand-ink/20 to-transparent p-6 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-secondary">
          Vista previa
        </p>
        <p className="mt-2 max-w-md text-base text-white">
          {ubicaciones.length
            ? `${ubicaciones.length} puntos en el territorio.`
            : "Explorá el territorio completo."}{" "}
          Entrá para navegar con filtros y detalle.
        </p>
        <span className="mt-5 inline-flex h-12 items-center rounded-full bg-brand-secondary px-8 text-sm font-semibold text-brand-ink shadow-glow-secondary transition-transform duration-base group-hover:-translate-y-0.5">
          Entrar al mapa
        </span>
      </div>
    </Link>
  );
}
