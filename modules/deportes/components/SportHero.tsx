import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { BlobBackground } from "@/components/ui/blob-background";
import type { DeporteDetalle } from "@/modules/deportes/types";
import { DIFICULTAD_LABEL } from "@/modules/deportes/types";
import { FavoriteButton } from "@/modules/usuarios/components/FavoriteButton";

interface SportHeroProps {
  deporte: DeporteDetalle;
}

export function SportHero({ deporte }: SportHeroProps) {
  return (
    <section
      className="relative overflow-hidden pb-16 pt-28 sm:pt-32"
      aria-labelledby="deporte-titulo"
      style={{
        background: `linear-gradient(160deg, ${deporte.colorPrimario}22 0%, var(--color-brand-ink) 45%, var(--color-brand-ink) 100%)`,
      }}
    >
      <BlobBackground className="opacity-60" />
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(ellipse 80% 50% at 20% 40%, ${deporte.colorPrimario}55, transparent)`,
        }}
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <Badge variant="secondary" className="mb-4">
          {DIFICULTAD_LABEL[deporte.dificultad]}
        </Badge>
        <h1
          id="deporte-titulo"
          className="ds-display max-w-4xl text-display-sm text-white sm:text-display-md lg:text-display-lg"
        >
          {deporte.nombre}
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/80">
          {deporte.descripcion}
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <ButtonLink href="/mapa" variant="primary" size="lg">
            Dónde practicarlo
          </ButtonLink>
          <ButtonLink href="/documentales" variant="outline" size="lg">
            Ver documental
          </ButtonLink>
          <FavoriteButton entidad="deporte" entidadId={deporte.id} />
        </div>
      </div>
    </section>
  );
}
