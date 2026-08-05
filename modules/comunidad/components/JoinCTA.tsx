import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";

interface JoinCTAProps {
  autenticado?: boolean;
}

/** Acciones principales para participar en ALTERNA */
export function JoinCTA({ autenticado }: JoinCTAProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <ButtonLink href="/mapa" variant="primary" size="lg">
        Ir al mapa
      </ButtonLink>
      {autenticado ? (
        <ButtonLink href="/comunidad#sumar-punto" variant="secondary" size="lg">
          Sumar un punto
        </ButtonLink>
      ) : (
        <ButtonLink
          href="/ingresar?callbackUrl=/comunidad"
          variant="outline"
          size="lg"
        >
          Ingresar con Google
        </ButtonLink>
      )}
      <ButtonLink href="/contacto" variant="outline" size="lg">
        Escribinos
      </ButtonLink>
      <Link
        href="#sumarse"
        className="inline-flex h-12 items-center px-2 text-sm font-semibold text-brand-primary underline-offset-4 hover:underline"
      >
        Completar formulario →
      </Link>
    </div>
  );
}
