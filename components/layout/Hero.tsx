import { siteConfig } from "@/config/site";
import { BlobBackground } from "@/components/ui/blob-background";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Tag } from "@/components/ui/tag";
import { HeroVideo } from "@/components/layout/HeroVideo";

export function Hero() {
  return (
    <section
      className="hero-video relative flex min-h-[92dvh] items-end overflow-hidden bg-brand-ink pb-16 pt-28 sm:items-center sm:pb-20 sm:pt-32"
      aria-labelledby="hero-titulo"
    >
      <div className="absolute inset-0">
        <HeroVideo />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-ink/50 via-brand-ink/70 to-brand-ink" />
        <BlobBackground />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6">
        <Badge variant="secondary" className="mb-4">
          {siteConfig.defaultCity.name} · Proyecto transmedia
        </Badge>

        <h1
          id="hero-titulo"
          className="max-w-4xl font-display text-4xl font-black uppercase leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl"
        >
          {siteConfig.tagline}
        </h1>

        <p className="mt-5 max-w-2xl text-balance text-base leading-relaxed text-white/80 sm:text-lg">
          Ultimate, Newcom, Wingfoil y más: historias reales, comunidades vivas y
          formas distintas de practicar deporte en la ciudad.
        </p>

        <div className="mt-6 flex flex-wrap gap-2" role="list">
          <Tag>Documental</Tag>
          <Tag>Deportes alternativos</Tag>
          <Tag>Mapa comunitario</Tag>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/mapa" variant="primary" size="lg">
            Explorá alternativas
          </ButtonLink>
          <ButtonLink href="/documentales" variant="outline" size="lg">
            Ver documental
          </ButtonLink>
        </div>

        <dl className="mt-10 grid max-w-lg grid-cols-3 gap-3 text-center sm:gap-4">
          {[
            { value: "3", label: "disciplinas" },
            { value: "4+", label: "historias" },
            { value: "1", label: "mapa vivo" },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-organic border border-white/15 bg-white/5 px-3 py-3 backdrop-blur-sm"
            >
              <dt className="sr-only">{item.label}</dt>
              <dd className="font-display text-xl font-black text-white">{item.value}</dd>
              <dd className="mt-1 text-[0.65rem] font-semibold uppercase tracking-wide text-white/65">
                {item.label}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
