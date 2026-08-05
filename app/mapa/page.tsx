import type { Metadata } from "next";
import { ColorStripe } from "@/components/brand/ColorStripe";
import { siteConfig } from "@/config/site";
import { buildPageMetadata } from "@/lib/seo/metadata";
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
 * Mapa con aire en los 4 costados — no full-bleed.
 * El marco contiene filtros + canvas + panel.
 */
export default async function MapaPage({ searchParams }: MapaPageProps) {
  const { deporte } = await searchParams;
  const ubicaciones = await ubicacionService.listar({
    deporteSlug: deporte,
  });

  return (
    <main
      id="contenido-principal"
      className="bg-brand-surface px-3 pb-4 pt-20 sm:px-5 sm:pb-6 sm:pt-24 lg:px-8"
    >
      <ColorStripe className="mb-3 rounded-full sm:mb-4" />
      <div className="mx-auto h-[calc(100dvh-6.5rem)] max-w-content overflow-hidden rounded-frame border border-brand-ink/10 bg-brand-surface shadow-lift sm:h-[calc(100dvh-7.25rem)]">
        <MapPageClient ubicaciones={ubicaciones} deporteInicial={deporte} />
      </div>
    </main>
  );
}
