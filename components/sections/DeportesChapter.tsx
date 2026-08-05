import Image from "next/image";
import Link from "next/link";
import { BrandIcon } from "@/components/brand/BrandIcon";
import { ColorStripe } from "@/components/brand/ColorStripe";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { brandToneAt, resolveSportIcon } from "@/config/brand-assets";
import { deporteService } from "@/modules/deportes/services/deporte.service";
import { cn } from "@/lib/utils";

const toneClass = {
  primary: "text-brand-primary",
  secondary: "text-brand-secondary",
  accent: "text-brand-accent",
} as const;

/**
 * Capítulo Deportes — tres puertas visuales, no grilla de cards.
 */
export async function DeportesChapter() {
  const deportes = await deporteService.listar();
  const destacados = deportes.filter((d) => d.destacado).slice(0, 3);

  if (!destacados.length) return null;

  return (
    <section className="bg-brand-surface" aria-labelledby="deportes-capitulo">
      <ColorStripe />
      <Container className="py-16 sm:py-20">
        <Reveal>
          <h2
            id="deportes-capitulo"
            className="ds-display max-w-2xl text-display-sm text-brand-ink sm:text-display-md"
          >
            Tres puertas a otro deporte
          </h2>
          <p className="mt-4 max-w-lg text-brand-ink/70">
            Elegí una disciplina. Cada una tiene territorio, comunidad e historias propias.
          </p>
        </Reveal>
      </Container>

      <div className="grid md:grid-cols-3">
        {destacados.map((deporte, i) => {
          const tone = brandToneAt(i);
          return (
            <Reveal key={deporte.id} delay={i * 90}>
              <Link
                href={`/deportes/${deporte.slug}`}
                className="group relative block min-h-[70dvh] overflow-hidden focus-ring md:min-h-[80dvh]"
              >
                {deporte.coverUrl ? (
                  <Image
                    src={deporte.coverUrl}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="ds-media-zoom object-cover"
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
                  className="absolute inset-0 bg-gradient-to-t from-brand-ink via-brand-ink/35 to-transparent"
                  aria-hidden
                />
                <div
                  className={cn(
                    "absolute inset-x-0 top-0 h-1 origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100",
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
                    className="drop-shadow-lg opacity-90 transition-opacity group-hover:opacity-100"
                  />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                  <p className={cn("text-xs font-bold uppercase tracking-[0.2em]", toneClass[tone])}>
                    0{i + 1}
                  </p>
                  <h3 className="mt-2 font-display text-2xl font-black uppercase text-white sm:text-3xl">
                    {deporte.nombre}
                  </h3>
                  <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/75 opacity-90 transition-opacity group-hover:opacity-100">
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

      <Container className="py-10">
        <Link
          href="/deportes"
          className="rounded-sm text-sm font-semibold uppercase tracking-wider text-brand-primary transition-colors hover:text-brand-ink focus-ring"
        >
          Ver todos los deportes →
        </Link>
      </Container>
    </section>
  );
}
