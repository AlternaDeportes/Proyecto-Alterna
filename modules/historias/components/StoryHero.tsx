import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import type { HistoriaDetalle } from "@/modules/historias/types";
import { FavoriteButton } from "@/modules/usuarios/components/FavoriteButton";

interface StoryHeroProps {
  historia: HistoriaDetalle;
}

/** Hero editorial — quote monumental + retrato. */
export function StoryHero({ historia }: StoryHeroProps) {
  return (
    <header className="relative overflow-hidden border-b border-white/10">
      <div className="grid lg:grid-cols-2">
        <div className="relative min-h-[50dvh] lg:min-h-[85dvh]">
          {historia.coverUrl ? (
            <Image
              src={historia.coverUrl}
              alt={historia.titulo}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(160deg, ${historia.deporte.colorPrimario}, var(--color-brand-ink))`,
              }}
            />
          )}
        </div>

        <div className="relative flex flex-col justify-end bg-brand-ink px-6 py-16 pt-28 sm:px-10 sm:py-20 sm:pt-32 lg:px-14">
          <div
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              background: `radial-gradient(ellipse at 0% 100%, ${historia.deporte.colorPrimario}66, transparent 55%)`,
            }}
            aria-hidden
          />
          <Container narrow className="relative z-raised !mx-0 !max-w-none !px-0">
            <p className="ds-eyebrow mb-4">{historia.deporte.nombre}</p>
            <h1 className="ds-display text-display-sm text-white sm:text-display-md">
              {historia.titulo}
            </h1>
            {historia.pullQuote ? (
              <blockquote className="mt-8 border-l-4 border-brand-secondary pl-5 text-xl font-medium italic leading-snug text-white/90 sm:text-2xl lg:text-3xl">
                «{historia.pullQuote}»
              </blockquote>
            ) : null}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <FavoriteButton entidad="historia" entidadId={historia.id} />
              <p className="text-sm text-white/55">
                <Link
                  href={`/deportes/${historia.deporte.slug}`}
                  className="font-semibold text-brand-secondary hover:underline"
                >
                  Ver deporte
                </Link>
                {" · "}
                <Link href="/historias" className="hover:text-white hover:underline">
                  Todas las historias
                </Link>
              </p>
            </div>
          </Container>
        </div>
      </div>
    </header>
  );
}
