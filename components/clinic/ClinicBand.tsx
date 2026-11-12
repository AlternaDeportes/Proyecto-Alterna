import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/config/site";

/** Franja corta hacia el documental. */
export function ClinicBand() {
  return (
    <section className="border-t border-white/10 bg-brand-ink py-10 sm:py-12" aria-label="Documental">
      <Container className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-secondary">
            Documental
          </p>
          <p className="mt-2 max-w-xl text-base text-white/85">
            El documental de {siteConfig.name} ya se ve en la web. Ultimate, Newcom y Wingfoil en{" "}
            {siteConfig.defaultCity.name}.
          </p>
        </div>
        <ButtonLink href="/documentales" variant="secondary" size="lg">
          Ver el documental
        </ButtonLink>
      </Container>
    </section>
  );
}
