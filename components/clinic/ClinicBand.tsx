import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/config/site";

/** Franja corta hacia las fotos de la clínica. */
export function ClinicBand() {
  return (
    <section className="border-t border-white/10 bg-brand-ink py-10 sm:py-12" aria-label="Clínica de Ultimate">
      <Container className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-secondary">
            {siteConfig.clinica.title}
          </p>
          <p className="mt-2 max-w-xl text-base text-white/85">
            La clínica de Ultimate, en fotos. Gracias a Malón Querandí por el espacio y la predisposición.
          </p>
        </div>
        <ButtonLink href={siteConfig.clinica.href} variant="secondary" size="lg">
          Ver la clínica
        </ButtonLink>
      </Container>
    </section>
  );
}
