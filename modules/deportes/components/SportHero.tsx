import Image from "next/image";
import { BrandIcon } from "@/components/brand/BrandIcon";
import { ColorStripe } from "@/components/brand/ColorStripe";
import { ButtonLink } from "@/components/ui/button";
import { BlobBackground } from "@/components/ui/blob-background";
import { Container } from "@/components/ui/container";
import { resolveSportIcon } from "@/config/brand-assets";
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
    >
      <ColorStripe className="absolute inset-x-0 top-0 z-raised" />
      {deporte.coverUrl ? (
        <Image
          src={deporte.coverUrl}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-40"
          aria-hidden
        />
      ) : null}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(160deg, ${deporte.colorPrimario}33 0%, var(--color-brand-ink) 48%, var(--color-brand-ink) 100%)`,
        }}
        aria-hidden
      />
      <BlobBackground className="opacity-50" />

      <Container className="relative z-raised">
        <BrandIcon
          id={resolveSportIcon(deporte.slug)}
          size="xl"
          className="mb-5 drop-shadow-lg"
        />
        <p className="ds-eyebrow ds-eyebrow--secondary mb-4">
          {DIFICULTAD_LABEL[deporte.dificultad]}
        </p>
        <h1
          id="deporte-titulo"
          className="ds-display max-w-4xl text-display-sm text-white sm:text-display-md lg:text-display-lg"
        >
          {deporte.nombre}
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white">
          {deporte.descripcion}
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <ButtonLink href="/mapa" variant="primary" size="lg">
            Dónde practicarlo
          </ButtonLink>
          <ButtonLink href="/documentales" variant="outlineLight" size="lg">
            Ver documental
          </ButtonLink>
          <ButtonLink href="/historias" variant="accent" size="lg">
            Historias
          </ButtonLink>
          <FavoriteButton entidad="deporte" entidadId={deporte.id} />
        </div>
      </Container>
    </section>
  );
}
