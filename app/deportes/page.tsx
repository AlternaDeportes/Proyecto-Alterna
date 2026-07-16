import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import { BlobBackground } from "@/components/ui/blob-background";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { SportCard } from "@/modules/deportes/components/SportCard";
import { deporteService } from "@/modules/deportes/services/deporte.service";

export const metadata: Metadata = buildPageMetadata({
  title: "Deportes",
  description: `Deportes alternativos y amateurs en ${siteConfig.defaultCity.name}. Explorá disciplinas, historias y dónde practicarlas.`,
  path: "/deportes",
});

export default async function DeportesPage() {
  const deportes = await deporteService.listar();

  return (
    <main id="contenido-principal">
      <section className="relative overflow-hidden border-b border-white/10 py-20 pt-28 sm:py-24 sm:pt-32">
        <BlobBackground variant="section" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <Badge variant="secondary">Explorá</Badge>
            <h1 className="mt-3 max-w-3xl font-display text-4xl font-black uppercase text-white sm:text-5xl">
              Deportes por descubrir
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-white/75">
              Tres disciplinas poco mediáticas, muy vivas en {siteConfig.defaultCity.name}.
              Elegí la que te intrigue — o probá las tres.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-16 sm:py-20" aria-label="Listado de deportes">
        <div className="mx-auto grid max-w-6xl gap-5 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
          {deportes.map((deporte, i) => (
            <Reveal key={deporte.id} delay={i * 70}>
              <SportCard deporte={deporte} variant="dark" />
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  );
}
