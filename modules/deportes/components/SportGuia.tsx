const GUIAS = {
  "ultimate-frisbee": {
    href: "/guias/ultimate-frisbee.pdf",
    archivo: "Alterna-Ultimate-Frisbee.pdf",
  },
  newcom: {
    href: "/guias/newcom.pdf",
    archivo: "Alterna-Newcom.pdf",
  },
  wingfoil: {
    href: "/guias/wingfoil.pdf",
    archivo: "Alterna-Wingfoil.pdf",
  },
} as const;

interface SportGuiaProps {
  slug: string;
  nombre: string;
}

/** Descarga pública de la guía del deporte. No pide cuenta. */
export function SportGuia({ slug, nombre }: SportGuiaProps) {
  const guia = GUIAS[slug as keyof typeof GUIAS];
  if (!guia) return null;

  return (
    <section aria-labelledby="guia-deporte">
      <p className="ds-eyebrow mb-3">Para llevar</p>
      <h2 id="guia-deporte" className="ds-display text-2xl text-brand-ink sm:text-3xl">
        La guía de {nombre}
      </h2>
      <p className="mt-3 max-w-xl text-brand-ink/70">
        Reglas, equipo y por qué se juega. Se descarga directo, sin cuenta.
      </p>
      <a
        href={guia.href}
        download={guia.archivo}
        className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-brand-primary px-8 text-base font-semibold text-white shadow-glow-primary transition-all duration-base ease-brand hover:bg-brand-primary/90 focus-ring motion-safe:hover:-translate-y-0.5"
      >
        Descargar la guía
      </a>
    </section>
  );
}
