import { siteConfig } from "@/config/site";
import { BlobBackground } from "@/components/ui/blob-background";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { HeroVideo } from "@/components/layout/HeroVideo";

/**
 * Hero de marca — Fase A: wordmark implícito vía nav + tagline + CTAs.
 * Stats y chips se reducen; la composición prioriza marca + una idea + acción.
 * (Fase C refinará el arco narrativo completo.)
 */
export function Hero() {
  return (
    <section
      className="hero-video relative flex min-h-[88dvh] items-end overflow-hidden bg-brand-ink pb-16 pt-28 sm:min-h-[92dvh] sm:items-center sm:pb-20 sm:pt-32"
      aria-labelledby="hero-titulo"
    >
      <div className="absolute inset-0">
        <HeroVideo />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-ink/50 via-brand-ink/70 to-brand-ink" />
        <BlobBackground />
      </div>

      <Container className="relative z-raised w-full">
        <p className="ds-eyebrow mb-4">
          {siteConfig.defaultCity.name} · Proyecto transmedia
        </p>

        <h1
          id="hero-titulo"
          className="ds-display max-w-4xl text-display-sm text-white sm:text-display-lg lg:text-display-xl"
        >
          {siteConfig.tagline}
        </h1>

        <p className="mt-5 max-w-xl text-balance text-base leading-relaxed text-white/80 sm:text-lg">
          Historias reales de deportes amateurs y alternativos. Comunidades vivas y un mapa
          para descubrir otra forma de jugar en la ciudad.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/mapa" variant="primary" size="lg">
            Explorá el mapa
          </ButtonLink>
          <ButtonLink href="/documentales" variant="outline" size="lg">
            Ver documental
          </ButtonLink>
        </div>

        <ul className="mt-10 flex flex-wrap gap-2" aria-label="Universo ALTERNA">
          <li>
            <Badge variant="soft">Documental</Badge>
          </li>
          <li>
            <Badge variant="soft">Historias</Badge>
          </li>
          <li>
            <Badge variant="soft">Mapa comunitario</Badge>
          </li>
        </ul>
      </Container>
    </section>
  );
}
