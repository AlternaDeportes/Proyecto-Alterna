import { siteConfig } from "@/config/site";
import { ColorStripe } from "@/components/brand/ColorStripe";
import { BrandPattern } from "@/components/ui/brand-pattern";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";

/**
 * Manifiesto — trama de marca + tipografía (sin siluetas).
 */
export function ManifiestoSection() {
  return (
    <section
      className="relative min-h-[85dvh] overflow-hidden bg-brand-ink py-24 sm:py-32"
      aria-labelledby="manifiesto-titulo"
    >
      <BrandPattern variant="marksDiagonal" opacity={22} className="scale-110" />
      <div
        className="absolute inset-0 bg-gradient-to-t from-brand-ink via-brand-ink/80 to-brand-ink/92"
        aria-hidden
      />

      <Container className="relative z-raised flex min-h-[60dvh] flex-col justify-center">
        <Reveal>
          <h2
            id="manifiesto-titulo"
            className="ds-display max-w-4xl text-display-md text-white sm:text-display-lg"
          >
            No explicamos reglas.
            <span className="mt-2 block text-brand-secondary">Mostramos personas.</span>
          </h2>
          <ColorStripe className="mt-8 max-w-[12rem] rounded-full" />
          <p className="mt-10 max-w-xl text-lg leading-relaxed text-white sm:text-xl">
            <span className="text-white/75">
              Creemos en el esfuerzo compartido y en las comunidades que crecen lejos de las
              cámaras.{" "}
            </span>
            <span className="text-white">
              {siteConfig.name} da voz a deportes amateurs de {siteConfig.defaultCity.name}
            </span>
            <span className="text-white/75">
              {" "}
              — historias auténticas que invitan a descubrir otra forma de vivir el deporte.
            </span>
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
