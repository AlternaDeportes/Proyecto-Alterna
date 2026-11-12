"use client";

import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { ButtonLink } from "@/components/ui/button";

interface MagicLinkClientProps {
  token: string;
  callbackUrl: string;
}

export function MagicLinkClient({ token, callbackUrl }: MagicLinkClientProps) {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    signIn("magic-link", {
      token,
      redirect: false,
      callbackUrl,
    }).then((result) => {
      if (cancelled) return;
      if (result?.error) {
        setError("El enlace no es válido o ya caducó. Pedí uno nuevo desde Ingresar.");
        return;
      }
      window.location.assign(result?.url || callbackUrl);
    }).catch(() => {
      if (!cancelled) setError("No se pudo completar el ingreso.");
    });

    return () => {
      cancelled = true;
    };
  }, [token, callbackUrl]);

  if (error) {
    return (
      <div className="space-y-4">
        <p className="rounded-soft border border-red-400/40 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {error}
        </p>
        <ButtonLink href="/ingresar" variant="primary">
          Volver a ingresar
        </ButtonLink>
      </div>
    );
  }

  return <p className="text-sm text-brand-ink/70">Validando el enlace…</p>;
}
