import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { Hero } from "@/components/layout/Hero";
import { AudiovisualChapter } from "@/components/sections/AudiovisualChapter";
import { ComunidadChapter } from "@/components/sections/ComunidadChapter";
import { DeportesChapter } from "@/components/sections/DeportesChapter";
import { ManifiestoSection } from "@/components/sections/ManifiestoSection";
import { MapaChapter } from "@/components/sections/MapaChapter";
import { VocesChapter } from "@/components/sections/VocesChapter";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: siteConfig.tagline,
  description: siteConfig.description,
  path: "/",
});

/**
 * Home — arco narrativo documental (Fase C).
 * Hero → Manifiesto → Deportes → Voces → Audiovisual → Mapa → Comunidad
 */
export default function HomePage() {
  return (
    <main id="contenido-principal">
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
