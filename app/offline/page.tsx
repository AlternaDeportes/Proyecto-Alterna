import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Sin conexión",
  description: "Estás sin red. Algunas páginas de ALTERNA pueden seguir disponibles en caché.",
  path: "/offline",
  index: false,
});

export default function OfflinePage() {
  return (
    <main id="contenido-principal">
      <Section
        blobs="section"
        className="flex min-h-[70dvh] flex-col items-center justify-center pt-28 text-center sm:pt-32"
      >
        <div className="relative z-raised max-w-lg px-4">
          <p className="ds-eyebrow">Offline</p>
          <h1 className="mt-3 ds-display text-display-sm text-white sm:text-display-md">
            Sin conexión
          </h1>
          <p className="mt-4 text-base leading-relaxed text-white/70">
            No hay red en este momento. Cuando vuelvas a conectarte, recargá la página.
            Algunas secciones visitadas antes pueden seguir disponibles.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/" variant="secondary">
              Ir al inicio
            </ButtonLink>
            <ButtonLink href="/deportes" variant="outline">
              Deportes
            </ButtonLink>
          </div>
          <p className="mt-6 text-sm text-white/40">
            <Link href="/mapa" className="hover:underline">
              Mapa
            </Link>
            {" · "}
            <Link href="/historias" className="hover:underline">
              Historias
            </Link>
          </p>
        </div>
      </Section>
    </main>
  );
}
