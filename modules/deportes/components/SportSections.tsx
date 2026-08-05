import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import type { DeporteHistoriaItem, DeporteUbicacionItem } from "@/modules/deportes/types";

interface SportHistoriasProps {
  historias: DeporteHistoriaItem[];
  colorPrimario: string;
}

export function SportHistorias({ historias, colorPrimario }: SportHistoriasProps) {
  if (!historias.length) return null;

  return (
    <section aria-labelledby="historias-deporte">
      <p className="ds-eyebrow mb-3">Voces</p>
      <h2
        id="historias-deporte"
        className="ds-display text-2xl text-brand-ink sm:text-3xl"
      >
        Historias
      </h2>
      <p className="mt-2 max-w-xl text-brand-ink/65">
        Voces reales del documental vinculadas a esta disciplina.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {historias.map((historia, i) => (
          <Reveal key={historia.id} delay={i * 60}>
            <blockquote
              className="border-l-4 py-1 pl-5"
              style={{ borderLeftColor: colorPrimario }}
            >
              {historia.pullQuote ? (
                <p className="text-base font-medium italic leading-relaxed text-brand-ink/80 sm:text-lg">
                  «{historia.pullQuote}»
                </p>
              ) : null}
              <footer className="mt-4">
                <cite className="font-display text-sm font-bold uppercase not-italic text-brand-ink">
                  {historia.titulo}
                </cite>
                <Link
                  href={`/historias/${historia.slug}`}
                  className="mt-2 block rounded-sm text-sm font-semibold text-brand-primary hover:underline focus-ring"
                >
                  Leer historia →
                </Link>
              </footer>
            </blockquote>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

interface SportUbicacionesProps {
  ubicaciones: DeporteUbicacionItem[];
  deporteSlug: string;
  accentColor?: string;
}

export function SportUbicaciones({
  ubicaciones,
  deporteSlug,
  accentColor,
}: SportUbicacionesProps) {
  return (
    <section aria-labelledby="donde-practicar">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="ds-eyebrow mb-3">Territorio</p>
          <h2
            id="donde-practicar"
            className="ds-display text-2xl text-brand-ink sm:text-3xl"
          >
            Dónde practicar
          </h2>
          <p className="mt-2 text-brand-ink/65">
            Puntos en Santa Fe para sumarte o conocer la comunidad.
          </p>
        </div>
        <Link
          href={`/mapa?deporte=${deporteSlug}`}
          className="rounded-sm text-sm font-semibold uppercase tracking-wider text-brand-primary hover:text-brand-ink focus-ring"
        >
          Ver en el mapa →
        </Link>
      </div>

      {ubicaciones.length ? (
        <ul
          className="mt-8 divide-y divide-brand-ink/10 border-y border-brand-ink/10"
          role="list"
        >
          {ubicaciones.map((u) => (
            <li
              key={u.id}
              className="grid gap-1 py-5 sm:grid-cols-[1fr_auto] sm:items-baseline"
            >
              <div>
                <p className="font-display text-sm font-bold uppercase text-brand-ink">
                  {u.nombre}
                </p>
                <p className="mt-1 text-sm text-brand-ink/60">{u.direccion}</p>
              </div>
              <p
                className="text-xs font-semibold uppercase tracking-wide text-brand-accent"
                style={accentColor ? { color: accentColor } : undefined}
              >
                {u.horarios}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <Badge variant="muted" className="mt-6">
          Próximamente más puntos en el mapa
        </Badge>
      )}
    </section>
  );
}
