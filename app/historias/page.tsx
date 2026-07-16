import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { Badge } from "@/components/ui/badge";
import { BlobBackground } from "@/components/ui/blob-background";
import { Reveal } from "@/components/ui/reveal";
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
      <section className="relative overflow-hidden border-b border-white/10 py-20 pt-28 sm:py-24 sm:pt-32">
        <BlobBackground variant="section" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <Badge variant="secondary">Voces</Badge>
            <h1 className="mt-3 max-w-3xl font-display text-4xl font-black uppercase text-white sm:text-5xl">
              Historias
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-white/75">
              Personas reales del documental. Sus voces sostienen cada plataforma de{" "}
              {siteConfig.name}.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-16 text-brand-ink sm:py-20" aria-label="Listado de historias">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
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
        </div>
      </section>
    </main>
  );
}
