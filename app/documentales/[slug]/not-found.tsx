import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";

export default function DocumentalEpisodioNoEncontrado() {
  return (
    <main
      id="contenido-principal"
      className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-24 text-center"
    >
      <h1 className="font-display text-3xl font-black uppercase text-white">
        Capítulo no encontrado
      </h1>
      <p className="mt-3 max-w-md text-white/70">
        Ese episodio no existe o aún no fue publicado.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/documentales" variant="primary">
          Ver documental
        </ButtonLink>
        <Link
          href="/"
          className="rounded-full px-6 py-3 text-sm font-semibold text-white/80 underline-offset-4 hover:underline"
        >
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}
