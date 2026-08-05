import Image from "next/image";
import { siteConfig } from "@/config/site";
import { MANIFESTO_BG } from "@/config/media";
import { ColorStripe } from "@/components/brand/ColorStripe";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";

/**
 * Manifiesto — tipografía grande, poca copia, foto full-bleed.
 * Una sola idea: personas > reglas.
 */
export function ManifiestoSection() {
  return (
    <section
      className="relative min-h-[85dvh] overflow-hidden bg-brand-ink py-24 sm:py-32"
      aria-labelledby="manifiesto-titulo"
    >
      <Image
        src={MANIFESTO_BG}
        alt=""
        fill
        sizes="100vw"
        className="object-cover opacity-30"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-brand-ink via-brand-ink/90 to-brand-ink/40"
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
