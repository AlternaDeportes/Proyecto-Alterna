import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { CardLight } from "@/components/ui/card";
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
      <h2
        id="historias-deporte"
        className="font-display text-2xl font-black uppercase text-white sm:text-3xl"
      >
        Historias
      </h2>
      <p className="mt-2 max-w-xl text-white/65">
        Voces reales del documental ALTERNA vinculadas a esta disciplina.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {historias.map((historia, i) => (
          <Reveal key={historia.id} delay={i * 60}>
            <CardLight
              className="h-full border-l-4 transition hover:-translate-y-0.5 hover:shadow-lg"
              style={{ borderLeftColor: colorPrimario }}
            >
              {historia.pullQuote && (
                <p className="text-sm font-medium italic leading-relaxed text-brand-ink/80">
                  «{historia.pullQuote}»
                </p>
              )}
              <h3 className="mt-4 font-display text-base font-bold uppercase text-brand-ink">
                {historia.titulo}
              </h3>
              <Link
                href={`/historias/${historia.slug}`}
                className="mt-3 inline-block text-sm font-semibold text-brand-primary hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-primary"
              >
                Leer historia →
              </Link>
            </CardLight>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

interface SportUbicacionesProps {
  ubicaciones: DeporteUbicacionItem[];
  deporteSlug: string;
}

export function SportUbicaciones({ ubicaciones, deporteSlug }: SportUbicacionesProps) {
  return (
    <section aria-labelledby="donde-practicar">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2
            id="donde-practicar"
            className="font-display text-2xl font-black uppercase text-white sm:text-3xl"
          >
            Dónde practicar
          </h2>
          <p className="mt-2 text-white/65">
            Puntos en Santa Fe para sumarte o conocer la comunidad.
          </p>
        </div>
        <Link
          href={`/mapa?deporte=${deporteSlug}`}
          className="text-sm font-semibold text-brand-secondary hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-secondary"
        >
          Ver todos en el mapa →
        </Link>
      </div>

      {ubicaciones.length ? (
        <ul className="mt-8 grid gap-3 sm:grid-cols-2" role="list">
          {ubicaciones.map((u) => (
            <li key={u.id}>
              <CardLight className="h-full">
                <p className="font-display text-sm font-bold uppercase text-brand-ink">
                  {u.nombre}
                </p>
                <p className="mt-1 text-sm text-brand-ink/65">{u.direccion}</p>
                <p className="mt-2 text-xs font-semibold text-brand-primary">{u.horarios}</p>
              </CardLight>
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
