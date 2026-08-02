import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { HistoriaDetalle } from "@/modules/historias/types";
import { FavoriteButton } from "@/modules/usuarios/components/FavoriteButton";

interface StoryHeroProps {
  historia: HistoriaDetalle;
}

export function StoryHero({ historia }: StoryHeroProps) {
  return (
    <header className="relative overflow-hidden border-b border-white/10 py-20 pt-28 sm:py-24 sm:pt-32">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background: `radial-gradient(ellipse at 20% 20%, ${historia.deporte.colorPrimario}66, transparent 55%)`,
        }}
        aria-hidden
      />
      <div className="relative mx-auto max-w-3xl px-4 sm:px-6">
        <Badge variant="secondary">{historia.deporte.nombre}</Badge>
        <h1 className="mt-4 ds-display text-display-sm text-white sm:text-display-md">
          {historia.titulo}
        </h1>
        {historia.pullQuote ? (
          <blockquote className="mt-6 border-l-4 border-brand-secondary pl-5 text-xl font-medium italic leading-relaxed text-white/90 sm:text-2xl">
            «{historia.pullQuote}»
          </blockquote>
        ) : null}
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <FavoriteButton entidad="historia" entidadId={historia.id} />
          <p className="text-sm text-white/55">
            <Link
              href={`/deportes/${historia.deporte.slug}`}
              className="font-semibold text-brand-secondary hover:underline"
            >
              Ver deporte
            </Link>
            {" · "}
            <Link href="/historias" className="hover:text-white hover:underline">
              Todas las historias
            </Link>
          </p>
        </div>
      </div>
    </header>
  );
}
