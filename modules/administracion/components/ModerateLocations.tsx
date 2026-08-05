"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { AdminUbicacionPendiente } from "@/modules/administracion/types";

interface ModerateLocationsProps {
  items: AdminUbicacionPendiente[];
}

export function ModerateLocations({ items: initial }: ModerateLocationsProps) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function moderar(id: string, accion: "aprobar" | "rechazar") {
    setBusyId(id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/ubicaciones/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accion }),
      });
      const payload = (await res.json()) as { ok: boolean; message?: string };
      if (!res.ok || !payload.ok) {
        setError(payload.message ?? "No se pudo moderar.");
        return;
      }
      setItems((prev) => prev.filter((i) => i.id !== id));
      router.refresh();
    } catch {
      setError("Error de red.");
    } finally {
      setBusyId(null);
    }
  }

  if (!items.length) {
    return (
      <p className="mt-3 text-sm text-brand-ink/55">No hay puntos pendientes de revisión.</p>
    );
  }

  return (
    <div className="mt-4 space-y-3">
      {error ? <p className="text-sm text-brand-accent">{error}</p> : null}
      {items.map((u) => (
        <article
          key={u.id}
          className="rounded-xl border border-brand-ink/10 bg-brand-ink/[0.03] px-4 py-4"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="font-semibold text-brand-ink">{u.nombre}</h3>
              <p className="mt-1 text-xs text-brand-ink/50">
                {u.deporteNombre} · {u.ciudadNombre} · {u.direccion}
              </p>
              {u.creadorEmail ? (
                <p className="mt-1 text-xs text-brand-ink/40">
                  Propuesto por {u.creadorNombre ?? "usuario"} ({u.creadorEmail})
                </p>
              ) : null}
              {u.historia ? (
                <p className="mt-2 max-w-xl text-sm text-brand-ink/70">{u.historia}</p>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                size="sm"
                variant="secondary"
                disabled={busyId === u.id}
                onClick={() => void moderar(u.id, "aprobar")}
              >
                Aprobar
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={busyId === u.id}
                onClick={() => void moderar(u.id, "rechazar")}
              >
                Rechazar
              </Button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
