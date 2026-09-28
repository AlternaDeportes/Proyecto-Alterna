import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { Hero } from "@/components/layout/Hero";
import { AudiovisualChapter } from "@/components/sections/AudiovisualChapter";
import { ComunidadChapter } from "@/components/sections/ComunidadChapter";
import { DeportesChapter } from "@/components/sections/DeportesChapter";
import { ManifiestoSection } from "@/components/sections/ManifiestoSection";
import { MapaChapter } from "@/components/sections/MapaChapter";
import { TeaserChapter } from "@/components/sections/TeaserChapter";
import { VocesChapter } from "@/components/sections/VocesChapter";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: siteConfig.tabName,
  description: siteConfig.description,
  path: "/",
  absolute: true,
});

/**
 * Home — arco narrativo documental (Fase C).
 * Teaser (destacado temporal) → Hero → Manifiesto → Deportes → Voces → Audiovisual → Mapa → Comunidad
 */
export default function HomePage() {
  return (
    <main id="contenido-principal">
      <TeaserChapter />
      <Hero />
      <ManifiestoSection />
      <DeportesChapter />
      <VocesChapter />
      <AudiovisualChapter />
      <MapaChapter />
      <ComunidadChapter />
    </main>
  );
}
