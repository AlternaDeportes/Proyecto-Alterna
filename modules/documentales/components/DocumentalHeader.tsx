import { siteConfig } from "@/config/site";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import type { DocumentalShow } from "@/modules/documentales/types";

interface DocumentalHeaderProps {
  show: DocumentalShow;
}

export function DocumentalHeader({ show }: DocumentalHeaderProps) {
  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <Badge variant="secondary">Narrativa audiovisual</Badge>
        <h1 className="mt-3 font-display text-4xl font-black uppercase text-white sm:text-5xl">
          Documental
        </h1>
        <p className="mt-2 font-display text-lg font-bold text-brand-secondary">
          {show.titulo}
        </p>
        <p className="mt-4 max-w-2xl text-lg text-white/75">{show.sinopsis}</p>
        <p className="mt-3 text-sm text-white/50">
          Orden sugerido: Trailer → Episodio 01 → Episodio 02
        </p>
      </div>
      <ButtonLink
        href={siteConfig.social.youtube}
        target="_blank"
        rel="noopener noreferrer"
        variant="secondary"
        size="lg"
      >
        Canal de YouTube
      </ButtonLink>
    </div>
  );
}
