import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BrandIcon } from "@/components/brand/BrandIcon";
import { ColorStripe } from "@/components/brand/ColorStripe";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { siteConfig } from "@/config/site";
import { brandToneAt, resolveSportIcon } from "@/config/brand-assets";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { cn } from "@/lib/utils";
import { deporteService } from "@/modules/deportes/services/deporte.service";

export const metadata: Metadata = buildPageMetadata({
  title: "Deportes",
  description: `Deportes alternativos y amateurs en ${siteConfig.defaultCity.name}. Explorá disciplinas, historias y dónde practicarlas.`,
  path: "/deportes",
});

const toneClass = {
  primary: "text-brand-primary",
  secondary: "text-brand-secondary",
  accent: "text-brand-accent",
} as const;

/** Listado editorial — mismas puertas visuales que el capítulo de home. */
export default async function DeportesPage() {
  const deportes = await deporteService.listar();

  return (
    <main id="contenido-principal">
      <ColorStripe />
      <section className="border-b border-brand-ink/10 bg-brand-surface pt-28 pb-16 sm:pt-32 sm:pb-20">
        <Container>
          <Reveal>
            <p className="ds-eyebrow ds-eyebrow--primary mb-4">Explorá</p>
            <h1 className="ds-display max-w-3xl text-display-sm text-brand-ink sm:text-display-md">
              Deportes por descubrir
            </h1>
            <p className="mt-5 max-w-xl text-lg text-brand-ink/70">
              Disciplinas poco mediáticas, muy vivas en {siteConfig.defaultCity.name}. Elegí
              una puerta — o cruzá las tres.
            </p>
          </Reveal>
        </Container>
      </section>

      <div className="grid md:grid-cols-3">
        {deportes.map((deporte, i) => {
          const tone = brandToneAt(i);
          return (
            <Reveal key={deporte.id} delay={i * 80}>
              <Link
                href={`/deportes/${deporte.slug}`}
                className="group relative block min-h-[72dvh] overflow-hidden focus-ring md:min-h-[85dvh]"
              >
                {deporte.coverUrl ? (
                  <Image
                    src={deporte.coverUrl}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="ds-media-zoom object-cover"
                    priority={i === 0}
                  />
                ) : (
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(160deg, ${deporte.colorPrimario}, var(--color-brand-ink))`,
                    }}
                  />
                )}
                <div
                  className="absolute inset-0 bg-gradient-to-t from-brand-ink via-brand-ink/40 to-transparent"
                  aria-hidden
                />
                <div
                  className={cn(
                    "absolute inset-x-0 top-0 h-1",
                    tone === "primary" && "bg-brand-primary",
                    tone === "secondary" && "bg-brand-secondary",
                    tone === "accent" && "bg-brand-accent"
                  )}
                  aria-hidden
                />
                <div className="absolute left-6 top-6 sm:left-8 sm:top-8">
                  <BrandIcon
                    id={resolveSportIcon(deporte.slug)}
                    size="lg"
                    className="drop-shadow-lg"
                  />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                  <p className={cn("text-xs font-bold uppercase tracking-[0.2em]", toneClass[tone])}>
                    0{i + 1}
                  </p>
                  <h2 className="mt-2 font-display text-2xl font-black uppercase text-white sm:text-3xl">
                    {deporte.nombre}
                  </h2>
                  <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/75">
                    {deporte.descripcion}
                  </p>
                  <span
                    className={cn(
                      "mt-5 inline-block text-xs font-semibold uppercase tracking-wider",
                      toneClass[tone]
                    )}
                  >
                    Entrar →
                  </span>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>

      <section className="border-t border-brand-ink/10 py-12">
        <Container>
          <Link
            href="/mapa"
            className="rounded-sm text-sm font-semibold uppercase tracking-wider text-brand-accent hover:text-brand-ink focus-ring"
          >
            Verlos en el mapa →
          </Link>
        </Container>
      </section>
    </main>
  );
}
