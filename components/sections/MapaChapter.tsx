import { BrandIcon } from "@/components/brand/BrandIcon";
import { ColorStripe } from "@/components/brand/ColorStripe";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { siteConfig } from "@/config/site";
import { MiniMapTeaser } from "@/modules/mapa/components/MiniMapTeaser";
import { ubicacionService } from "@/modules/mapa/services/ubicacion.service";

/**
 * Capítulo mapa — minimapa teaser; la navegación real vive en /mapa.
 */
export async function MapaChapter() {
  const ubicaciones = await ubicacionService.listar({});

  return (
    <section
      className="relative overflow-hidden bg-brand-surface py-20 sm:py-28"
      aria-labelledby="mapa-capitulo"
    >
      <ColorStripe className="absolute inset-x-0 top-0" />
      <Container>
        <Reveal>
          <div className="mb-4">
            <BrandIcon id="mapaPuente" size="sm" />
          </div>
          <h2
            id="mapa-capitulo"
            className="ds-display max-w-3xl text-display-sm text-brand-ink sm:text-display-md"
          >
            El mapa es el puente
          </h2>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-brand-ink/70">
            De acá salís hacia la cancha, el club o la costa. Encontrá dónde se entrena en{" "}
            {siteConfig.defaultCity.name} y andá a conocerlos.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <ButtonLink href="/mapa" variant="secondary" size="lg">
              Encontrá tu lugar
            </ButtonLink>
            <ButtonLink href="/clinica" variant="accent" size="lg">
              Anotate a la clínica
            </ButtonLink>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <MiniMapTeaser ubicaciones={ubicaciones} />
        </Reveal>
      </Container>
    </section>
  );
}
