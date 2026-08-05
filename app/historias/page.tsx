import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BrandIcon } from "@/components/brand/BrandIcon";
import { ColorStripe } from "@/components/brand/ColorStripe";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { buildPageMetadata } from "@/lib/seo/metadata";
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
      <ColorStripe />
      <section className="border-b border-brand-ink/10 bg-brand-surface pt-28 pb-16 sm:pt-32 sm:pb-20">
        <Container>
          <Reveal>
            <div className="mb-4 flex items-center gap-3">
              <BrandIcon id="pasion" size="sm" />
              <p className="ds-eyebrow ds-eyebrow--accent !mb-0">Voces</p>
            </div>
            <h1 className="ds-display max-w-3xl text-display-sm text-brand-ink sm:text-display-md">
              Historias
            </h1>
            <p className="mt-5 max-w-xl text-lg text-brand-ink/70">
              Personas reales del documental. Sus voces sostienen cada plataforma de{" "}
              <span className="font-semibold text-brand-ink">{siteConfig.name}</span>.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="bg-brand-surface py-16 text-brand-ink sm:py-20" aria-label="Listado">
        <Container>
          {!historias.length ? (
            <p className="text-brand-ink/60">Todavía no hay historias publicadas.</p>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:gap-10">
              {historias.map((historia, i) => (
                <Reveal key={historia.id} delay={i * 60}>
                  <Link
                    href={`/historias/${historia.slug}`}
                    className="group block focus-ring rounded-frame"
                  >
                    <div className="ds-frame ds-frame--paper relative aspect-[3/4] overflow-hidden bg-brand-ink">
                      {historia.coverUrl ? (
                        <Image
                          src={historia.coverUrl}
                          alt={historia.titulo}
                          fill
                          sizes="(max-width: 640px) 100vw, 50vw"
                          className="ds-media-zoom object-cover"
                          priority={i < 2}
                        />
                      ) : (
                        <div
                          className="absolute inset-0"
                          style={{
                            background: `linear-gradient(160deg, ${historia.deporte.colorPrimario}, var(--color-brand-ink))`,
                          }}
                        />
                      )}
                      <div
                        className="absolute inset-0 bg-gradient-to-t from-brand-ink/95 via-brand-ink/25 to-transparent"
                        aria-hidden
                      />
                      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-secondary">
                          {historia.deporte.nombre}
                        </p>
                        <h2 className="mt-2 font-display text-xl font-black uppercase text-white sm:text-2xl">
                          {historia.titulo}
                        </h2>
                        {historia.pullQuote ? (
                          <p className="mt-3 line-clamp-3 text-sm italic text-white/75">
                            «{historia.pullQuote}»
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </Container>
      </section>
    </main>
  );
}
