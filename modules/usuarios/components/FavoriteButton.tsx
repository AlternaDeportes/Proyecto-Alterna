"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { FavoritoEntidad } from "@/modules/usuarios/types";

interface FavoriteButtonProps {
  entidad: FavoritoEntidad;
  entidadId: string;
  className?: string;
  /** Variante para fondos claros */
  light?: boolean;
}

export function FavoriteButton({
  entidad,
  entidadId,
  className,
  light,
}: FavoriteButtonProps) {
  const { data: session, status } = useSession();
  const [activo, setActivo] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!session?.user || status !== "authenticated") {
      setActivo(false);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/usuarios/favoritos");
        const payload = (await res.json()) as {
          ok: boolean;
          data?: { entidad: string; entidadId: string }[];
        };
        if (!cancelled && payload.ok && payload.data) {
          setActivo(
            payload.data.some((f) => f.entidad === entidad && f.entidadId === entidadId)
          );
        }
      } catch {
        /* ignore */
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [session?.user, status, entidad, entidadId]);

  if (status === "loading") return null;

  if (!session?.user) {
    return (
      <Link
        href={`/ingresar?callbackUrl=${encodeURIComponent(
          typeof window !== "undefined" ? window.location.pathname : "/perfil"
        )}`}
        className={cn(
          "text-xs font-semibold underline-offset-4 hover:underline",
          light ? "text-brand-primary" : "text-brand-secondary",
          className
        )}
      >
        Ingresá para guardar
      </Link>
    );
  }

  async function toggle() {
    setLoading(true);
    try {
      const res = await fetch("/api/usuarios/favoritos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entidad, entidadId }),
      });
      const payload = (await res.json()) as {
        ok: boolean;
        data?: { favorito: boolean };
        message?: string;
      };
      if (res.ok && payload.data) {
        setActivo(payload.data.favorito);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      type="button"
      size="sm"
      variant={activo ? "secondary" : light ? "outline" : "outlineLight"}
      disabled={loading}
      onClick={() => void toggle()}
      className={className}
      aria-pressed={activo}
    >
      {activo ? "★ Guardado" : "☆ Guardar"}
    </Button>
  );
}
