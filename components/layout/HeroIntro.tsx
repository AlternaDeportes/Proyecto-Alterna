"use client";

import { useEffect, useState } from "react";
import { ColorStripe } from "@/components/brand/ColorStripe";
import { siteConfig } from "@/config/site";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { usePrefersReducedMotion } from "@/lib/motion/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

/** Copy del hero con entrada de presencia (intención scroll/load). */
export function HeroIntro() {
  const reduced = usePrefersReducedMotion();
  const [ready, setReady] = useState(reduced);

  useEffect(() => {
    if (reduced) {
      setReady(true);
      return;
    }
    const id = window.setTimeout(() => setReady(true), 80);
    return () => window.clearTimeout(id);
  }, [reduced]);

  return (
    <Container
      className={cn(
        "relative z-raised w-full transition-[opacity,transform] duration-700 ease-brand",
        ready ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
      )}
    >
      <a
        href="#audiovisual-capitulo"
        className="mb-6 inline-flex items-center gap-2 rounded-full bg-brand-secondary px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-brand-ink shadow-glow-secondary transition-transform duration-300 hover:scale-[1.03] focus-ring sm:text-xs"
      >
        Teaser · {siteConfig.teaser.label}
        <span aria-hidden>→</span>
      </a>

      <p className="ds-eyebrow ds-eyebrow--secondary mb-5">{siteConfig.defaultCity.name}</p>

      <h1
        id="hero-titulo"
        className="ds-display max-w-4xl text-display-md text-white sm:text-display-lg lg:text-display-xl"
      >
        Deportes amateurs en Santa Fe
      </h1>

      <ColorStripe className="mt-6 max-w-[10rem] rounded-full" />

      <p className="mt-6 max-w-xl text-base leading-relaxed text-white sm:text-lg">
        ALTERNA sigue a quienes juegan ultimate, newcom y wingfoil: entrenamientos,
        lugares y comunidades.
      </p>

      <div className="mt-10 flex flex-wrap items-center gap-4">
        <ButtonLink href="#audiovisual-capitulo" variant="secondary" size="lg">
          Teaser · {siteConfig.teaser.shortLabel}
        </ButtonLink>
        <ButtonLink href="/mapa" variant="outlineLight" size="lg">
          Explorá el mapa
        </ButtonLink>
        <ButtonLink href="/deportes" variant="accent" size="lg">
          Deportes
        </ButtonLink>
      </div>
    </Container>
  );
}
