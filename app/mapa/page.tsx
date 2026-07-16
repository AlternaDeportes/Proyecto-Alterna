import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { MapPageClient } from "@/modules/mapa/components/MapPageClient";
import { ubicacionService } from "@/modules/mapa/services/ubicacion.service";

export const metadata: Metadata = buildPageMetadata({
  title: "Mapa",
  description: `Mapa interactivo de deportes alternativos en ${siteConfig.defaultCity.name}. Filtrá, explorá y sumá tu punto.`,
  path: "/mapa",
});

interface MapaPageProps {
  searchParams: Promise<{ deporte?: string }>;
}

export default async function MapaPage({ searchParams }: MapaPageProps) {
  const { deporte } = await searchParams;
  const ubicaciones = await ubicacionService.listar({
    deporteSlug: deporte,
  });

  return (
    <main
      id="contenido-principal"
      className="fixed inset-x-0 top-16 z-10 h-[calc(100dvh-4rem)]"
    >
      <MapPageClient ubicaciones={ubicaciones} deporteInicial={deporte} />
    </main>
  );
}
