import { siteConfig } from "@/config/site";
import { BrandIcon } from "@/components/brand/BrandIcon";
import { ColorStripe } from "@/components/brand/ColorStripe";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";

/**
 * Cierre del viaje — pertenencia, no feature dump.
 */
export function ComunidadChapter() {
  return (
    <section
      className="relative overflow-hidden border-t border-brand-ink/10 bg-brand-surface py-24 sm:py-32"
      aria-labelledby="comunidad-capitulo"
    >
      <ColorStripe className="absolute inset-x-0 top-0" />
      <Container className="relative z-raised">
        <Reveal>
          <BrandIcon id="comunidadPersonas" size="lg" className="mb-6" />
          <h2
            id="comunidad-capitulo"
            className="ds-display max-w-2xl text-display-sm text-brand-ink sm:text-display-md"
          >
            El puente se arma entre todos
          </h2>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-brand-ink/70">
            Si jugás, contanos tu lugar. Si querés empezar, el mapa te lleva. Si tenés una
            historia, escribinos:{" "}
            <span className="font-semibold text-brand-ink">{siteConfig.name}</span> se
            sostiene con esa ida y vuelta.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <ButtonLink href="/comunidad" variant="secondary" size="lg">
              Sumate
            </ButtonLink>
            <ButtonLink href="/contacto" variant="outline" size="lg">
              Escribinos
            </ButtonLink>
            <ButtonLink href="/comunidad#sumar-punto" variant="accent" size="lg">
              Proponé un lugar
            </ButtonLink>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
