"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  FilterRow,
  StatusChip,
} from "@/modules/administracion/components/ModerateLocations";
import { fechaCortaAR } from "@/modules/administracion/lib/periodo";
import type { AdminComentario } from "@/modules/administracion/types";

interface ModerateCommentsProps {
  items: AdminComentario[];
}

type Filtro = "PENDIENTE" | "APROBADO" | "RECHAZADO" | "TODOS";

export function ModerateComments({ items: initial }: ModerateCommentsProps) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [filtro, setFiltro] = useState<Filtro>("PENDIENTE");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const visible = useMemo(
    () => (filtro === "TODOS" ? items : items.filter((i) => i.moderacion === filtro)),
    [filtro, items]
  );

  const counts = useMemo(
    () => ({
      PENDIENTE: items.filter((i) => i.moderacion === "PENDIENTE").length,
      APROBADO: items.filter((i) => i.moderacion === "APROBADO").length,
      RECHAZADO: items.filter((i) => i.moderacion === "RECHAZADO").length,
    }),
    [items]
  );

  async function moderar(id: string, accion: "aprobar" | "rechazar") {
    setBusyId(id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/comentarios/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accion }),
      });
      const payload = (await res.json()) as { ok: boolean; message?: string };
      if (!res.ok || !payload.ok) {
        setError(payload.message ?? "No se pudo moderar.");
        return;
      }
      setItems((prev) =>
        prev.map((i) =>
          i.id === id
            ? { ...i, moderacion: accion === "aprobar" ? "APROBADO" : "RECHAZADO" }
            : i
        )
      );
      router.refresh();
    } catch {
      setError("Error de red.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="mt-4 space-y-3">
      <FilterRow
        filtro={filtro}
        onChange={setFiltro}
        counts={counts}
        labels={{ PENDIENTE: "Pendientes", APROBADO: "Publicados", RECHAZADO: "Ocultos" }}
      />
      {error ? <p className="text-sm text-brand-accent">{error}</p> : null}
      {!visible.length ? (
        <p className="text-sm text-brand-ink/55">No hay comentarios en este filtro.</p>
      ) : (
        visible.map((c) => (
          <article
            key={c.id}
            className="rounded-2xl border border-brand-ink/10 bg-white px-4 py-4 shadow-soft"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-brand-ink">{c.autorNombre}</h3>
                  <StatusChip estado={c.moderacion} />
                </div>
                <p className="mt-1 text-xs text-brand-ink/45">
                  {c.autorEmail} · {c.deporteNombre} · {c.ubicacionNombre}
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm text-brand-ink/80">{c.texto}</p>
                <p className="mt-2 text-xs text-brand-ink/35">{fechaCortaAR(c.createdAt)}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {c.moderacion !== "APROBADO" ? (
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    disabled={busyId === c.id}
                    onClick={() => void moderar(c.id, "aprobar")}
                  >
                    Aprobar
                  </Button>
                ) : null}
                {c.moderacion !== "RECHAZADO" ? (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={busyId === c.id}
                    onClick={() => void moderar(c.id, "rechazar")}
                  >
                    Rechazar
                  </Button>
                ) : null}
              </div>
            </div>
          </article>
        ))
      )}
    </div>
  );
}
