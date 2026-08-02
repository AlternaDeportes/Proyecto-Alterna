import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { StoryCard } from "@/modules/historias/components/StoryCard";
import { historiaService } from "@/modules/historias/services/historia.service";

export const metadata: Metadata = buildPageMetadata({
  title: "Historias",
  description: `Voces reales del documental ${siteConfig.name}: protagonistas de deportes alternativos en ${siteConfig.defaultCity.name}.`,
  path: "/historias",
});

interface HistoriasPageProps {
  searchParams: Promise<{ deporte?: string }>;
}

export default async function HistoriasPage({ searchParams }: HistoriasPageProps) {
  const { deporte } = await searchParams;
  const historias = await historiaService.listar(deporte);

  return (
    <main id="contenido-principal">
      <PageHeader
        eyebrow="Voces"
        title="Historias"
        description={`Personas reales del documental. Sus voces sostienen cada plataforma de ${siteConfig.name}.`}
      />

      <Section tone="paper" aria-label="Listado de historias" density="tight">
        <Container>
          {!historias.length ? (
            <p className="text-brand-ink/60">Todavía no hay historias publicadas.</p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2">
              {historias.map((historia, i) => (
                <Reveal key={historia.id} delay={i * 50}>
                  <StoryCard historia={historia} />
                </Reveal>
              ))}
            </div>
          )}
        </Container>
      </Section>
    </main>
  );
}
