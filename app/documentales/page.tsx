import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
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
      <Section tone="ink" border="bottom" blobs="section" className="pt-28 sm:pt-32">
        <Container>
          <Reveal>
            <DocumentalHeader show={show} />
          </Reveal>
        </Container>
      </Section>

      <Section aria-label="Episodios del documental" density="tight">
        <Container>
          <h2 className="ds-display text-2xl text-white">Capítulos</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {show.episodios.map((ep, i) => (
              <Reveal key={ep.id} delay={i * 50}>
                <DocEpisodeCard episodio={ep} destacada={i === 0} />
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>
    </main>
  );
}
