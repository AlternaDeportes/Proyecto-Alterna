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
            El mapa es el corazón
          </h2>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-brand-ink/70">
            Una vista previa de dónde se entrena en {siteConfig.defaultCity.name}. Para filtrar,
            acercarte y sumar puntos, entrá al mapa.
          </p>
          <div className="mt-8">
            <ButtonLink href="/mapa" variant="secondary" size="lg">
              Ir al mapa
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
