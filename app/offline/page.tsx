import type { Metadata } from "next";
import Link from "next/link";
import { BlobBackground } from "@/components/ui/blob-background";
import { ButtonLink } from "@/components/ui/button";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Sin conexión",
  description: "Estás sin red. Algunas páginas de ALTERNA pueden seguir disponibles en caché.",
  path: "/offline",
  index: false,
});

export default function OfflinePage() {
  return (
    <main id="contenido-principal" className="relative overflow-hidden">
      <section className="relative flex min-h-[70dvh] flex-col items-center justify-center px-4 py-28 text-center sm:pt-32">
        <BlobBackground variant="section" />
        <div className="relative z-10 max-w-lg">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-secondary">
            Offline
          </p>
          <h1 className="mt-3 font-display text-4xl font-black uppercase text-white sm:text-5xl">
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
      </section>
    </main>
  );
}
