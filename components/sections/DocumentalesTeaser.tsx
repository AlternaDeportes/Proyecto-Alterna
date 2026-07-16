import { DocEpisodeCard } from "@/modules/documentales/components/DocEpisodeCard";
import { documentalService } from "@/modules/documentales/services/documental.service";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

export async function DocumentalesTeaser() {
  const show = await documentalService.obtenerShow();
  const episodios = show.episodios.slice(0, 3);

  if (!episodios.length) return null;

  return (
    <section
      className="border-y border-white/10 py-20 sm:py-24"
      aria-labelledby="documental-home-titulo"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Badge variant="secondary">Documental</Badge>
              <h2
                id="documental-home-titulo"
                className="mt-3 font-display text-3xl font-black uppercase text-white sm:text-4xl"
              >
                Narrativa audiovisual
              </h2>
              <p className="mt-3 max-w-xl text-base text-white/70">
                Trailer y episodios para profundizar en las historias humanas detrás de cada
                disciplina.
              </p>
            </div>
            <ButtonLink href="/documentales" variant="outline" size="sm">
              Ver documental
            </ButtonLink>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {episodios.map((ep, i) => (
            <Reveal key={ep.id} delay={i * 60}>
              <DocEpisodeCard episodio={ep} destacada={i === 0} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
