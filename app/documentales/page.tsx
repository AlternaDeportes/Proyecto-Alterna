import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { BlobBackground } from "@/components/ui/blob-background";
import { Reveal } from "@/components/ui/reveal";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { DocEpisodeCard } from "@/modules/documentales/components/DocEpisodeCard";
import { DocumentalHeader } from "@/modules/documentales/components/DocumentalHeader";
import { documentalService } from "@/modules/documentales/services/documental.service";

export const metadata: Metadata = buildPageMetadata({
  title: "Documental",
  description: `Serie documental ${siteConfig.name}: trailer y episodios sobre deportes alternativos en ${siteConfig.defaultCity.name}.`,
  path: "/documentales",
});

export default async function DocumentalesPage() {
  const show = await documentalService.obtenerShow();

  return (
    <main id="contenido-principal">
      <section className="relative overflow-hidden border-b border-white/10 py-20 pt-28 sm:py-24 sm:pt-32">
        <BlobBackground variant="section" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <DocumentalHeader show={show} />
          </Reveal>
        </div>
      </section>

      <section className="py-16 sm:py-20" aria-label="Episodios del documental">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-display text-2xl font-black uppercase text-white">
            Capítulos
          </h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {show.episodios.map((ep, i) => (
              <Reveal key={ep.id} delay={i * 50}>
                <DocEpisodeCard episodio={ep} destacada={i === 0} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
