import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";

export default function HistoriaNoEncontrada() {
  return (
    <main
      id="contenido-principal"
      className="flex min-h-[60vh] flex-col items-center justify-center bg-brand-surface px-4 py-24 text-center"
    >
      <h1 className="font-display text-3xl font-black uppercase text-brand-ink">
        Historia no encontrada
      </h1>
      <p className="mt-3 max-w-md text-brand-ink/70">
        Ese relato no existe o aún no fue publicado.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/historias" variant="primary">
          Ver historias
        </ButtonLink>
        <Link
          href="/"
          className="rounded-full px-6 py-3 text-sm font-semibold text-brand-ink/70 underline-offset-4 hover:text-brand-primary hover:underline"
        >
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}
