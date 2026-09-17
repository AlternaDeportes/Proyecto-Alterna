import type { Metadata } from "next";
import { ColorStripe } from "@/components/brand/ColorStripe";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/config/site";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { deporteService } from "@/modules/deportes/services/deporte.service";
import { MapPageClient } from "@/modules/mapa/components/MapPageClient";
import { ubicacionService } from "@/modules/mapa/services/ubicacion.service";

export const metadata: Metadata = buildPageMetadata({
  title: "Mapa",
  description: `Mapa de deportes en Santa Fe y alrededores (hasta 100 km). Filtrá por deporte, explorá la región y sumá tu punto.`,
  path: "/mapa",
});

interface MapaPageProps {
  searchParams: Promise<{ deporte?: string }>;
}

/**
 * Territorio: mapa a la izquierda y ficha de deporte a la derecha.
 */
export default async function MapaPage({ searchParams }: MapaPageProps) {
  const { deporte } = await searchParams;
  const [ubicaciones, deportes] = await Promise.all([
    ubicacionService.listar(),
    deporteService.listar(),
  ]);

  return (
    <main id="contenido-principal" className="bg-brand-surface">
      <ColorStripe />
      <section className="border-b border-brand-ink/10 pt-28 pb-10 sm:pt-32 sm:pb-12">
        <Container>
          <p className="ds-eyebrow ds-eyebrow--primary mb-4">Territorio</p>
          <h1 className="ds-display max-w-3xl text-display-sm text-brand-ink sm:text-display-md">
            Encontrá tu deporte
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-brand-ink/70">
            Clubes de Newcom, Ultimate y Wingfoil en {siteConfig.defaultCity.name},
            Santo Tomé y Monte Vera. Elegí un deporte a la derecha o tocá un punto
            en el mapa.
          </p>
        </Container>
      </section>

      <section className="pb-16 sm:pb-20" aria-label="Mapa y deportes">
        <Container>
          <MapPageClient ubicaciones={ubicaciones} deportes={deportes} deporteInicial={deporte} />
        </Container>
      </section>
    </main>
  );
}
