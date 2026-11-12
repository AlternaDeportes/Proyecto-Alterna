import type { Metadata } from "next";
import Image from "next/image";
import { ColorStripe } from "@/components/brand/ColorStripe";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { clinicGallery, IMAGE_QUALITY } from "@/config/media";
import { siteConfig } from "@/config/site";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Clínica",
  description: `La clínica de Ultimate de ${siteConfig.tabName}. Gracias a Malón Querandí por el espacio y la predisposición.`,
  path: "/clinica",
});

export default function ClinicaPage() {
  return (
    <main id="contenido-principal">
      <ColorStripe />
      <section className="border-b border-brand-ink/10 bg-brand-surface pt-24 pb-10 sm:pt-28 sm:pb-12">
        <Container>
          <Reveal>
            <p className="ds-eyebrow ds-eyebrow--primary mb-4">Ultimate Frisbee</p>
            <h1 className="ds-display max-w-xl text-display-sm text-brand-ink sm:text-display-md">
              {siteConfig.clinica.title}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-brand-ink/70">
              La clínica fue un encuentro para probar el Ultimate, tirar el disco y
              conocer a quien ya lo juega. Gracias a Malón Querandí por el espacio
              y por la predisposición.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/deportes/ultimate-frisbee" variant="outline" size="lg">
                Ver Ultimate
              </ButtonLink>
              <ButtonLink href="/mapa" variant="secondary" size="lg">
                Encontrá dónde juegan
              </ButtonLink>
            </div>
          </Reveal>
          <ul className="mt-10 grid grid-cols-2 gap-2 sm:mt-12 sm:gap-4 lg:grid-cols-3">
            {clinicGallery.map((foto) => (
              <li key={foto.src}>
                <figure className="ds-frame ds-frame--ink relative aspect-[3/4] overflow-hidden sm:aspect-[4/3]">
                  <Image
                    src={foto.src}
                    alt={foto.alt}
                    fill
                    quality={IMAGE_QUALITY}
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </figure>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </main>
  );
}
