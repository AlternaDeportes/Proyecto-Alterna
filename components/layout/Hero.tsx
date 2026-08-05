import { HeroVideo } from "@/components/layout/HeroVideo";
import { HeroIntro } from "@/components/layout/HeroIntro";

/**
 * Primer viewport — una sola composición documental.
 * Motion: parallax de media + entrada de copy (Fase D).
 */
export function Hero() {
  return (
    <section
      className="relative flex min-h-[100dvh] items-end overflow-hidden bg-brand-ink pb-20 pt-28 sm:items-end sm:pb-24 sm:pt-32"
      aria-labelledby="hero-titulo"
    >
      <div className="absolute inset-0">
        <HeroVideo />
        <div
          className="absolute inset-0 bg-gradient-to-t from-brand-ink via-brand-ink/55 to-brand-ink/25"
          aria-hidden
        />
      </div>

      <HeroIntro />
    </section>
  );
}
