"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { fechaCortaAR } from "@/modules/administracion/lib/periodo";
import type { AdminUbicacionPendiente } from "@/modules/administracion/types";

interface ModerateLocationsProps {
  items: AdminUbicacionPendiente[];
}

type Filtro = "PENDIENTE" | "APROBADO" | "RECHAZADO" | "TODOS";

export function ModerateLocations({ items: initial }: ModerateLocationsProps) {
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
        labels={{ PENDIENTE: "Pendientes", APROBADO: "Aprobados", RECHAZADO: "Rechazados" }}
      />
      {error ? <p className="text-sm text-brand-accent">{error}</p> : null}
      {!visible.length ? (
        <p className="text-sm text-brand-ink/55">No hay puntos en este filtro.</p>
      ) : (
        visible.map((u) => (
          <article
            key={u.id}
            className="rounded-2xl border border-brand-ink/10 bg-white px-4 py-4 shadow-soft"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-brand-ink">{u.nombre}</h3>
                  <StatusChip estado={u.moderacion} />
                </div>
                <p className="mt-1 text-xs text-brand-ink/50">
                  {u.deporteNombre} · {u.ciudadNombre} · {u.direccion}
                </p>
                <p className="mt-1 text-xs text-brand-ink/40">
                  {u.lat.toFixed(5)}, {u.lng.toFixed(5)} · {u.horarios}
                </p>
                {u.creadorEmail ? (
                  <p className="mt-1 text-xs text-brand-ink/40">
                    Propuesto por {u.creadorNombre ?? "usuario"} ({u.creadorEmail}) ·{" "}
                    {fechaCortaAR(u.createdAt)}
                  </p>
                ) : (
                  <p className="mt-1 text-xs text-brand-ink/40">{fechaCortaAR(u.createdAt)}</p>
                )}
                {u.contacto ? (
                  <p className="mt-1 text-xs text-brand-ink/50">Contacto: {u.contacto}</p>
                ) : null}
                {u.historia ? (
                  <p className="mt-2 text-sm text-brand-ink/70">{u.historia}</p>
                ) : null}
              </div>
              <div className="flex flex-wrap gap-2">
                {u.moderacion !== "APROBADO" ? (
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    disabled={busyId === u.id}
                    onClick={() => void moderar(u.id, "aprobar")}
                  >
                    Aprobar
                  </Button>
                ) : null}
                {u.moderacion !== "RECHAZADO" ? (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={busyId === u.id}
                    onClick={() => void moderar(u.id, "rechazar")}
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

export function StatusChip({ estado }: { estado: string }) {
  const styles =
    estado === "APROBADO"
      ? "bg-brand-secondary/25 text-brand-ink"
      : estado === "RECHAZADO"
        ? "bg-brand-accent/20 text-brand-ink"
        : "bg-brand-primary/15 text-brand-primary";
  return (
    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${styles}`}>
      {estado === "PENDIENTE" ? "Pendiente" : estado === "APROBADO" ? "Aprobado" : "Rechazado"}
    </span>
  );
}

export function FilterRow({
  filtro,
  onChange,
  counts,
  labels,
}: {
  filtro: Filtro;
  onChange: (value: Filtro) => void;
  counts: { PENDIENTE: number; APROBADO: number; RECHAZADO: number };
  labels: { PENDIENTE: string; APROBADO: string; RECHAZADO: string };
}) {
  const options: Filtro[] = ["PENDIENTE", "APROBADO", "RECHAZADO", "TODOS"];
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((id) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
            filtro === id
              ? "bg-brand-ink text-white"
              : "bg-brand-ink/5 text-brand-ink/65 hover:bg-brand-ink/10"
          }`}
        >
          {id === "TODOS" ? "Todos" : labels[id]}
          {id !== "TODOS" ? ` · ${counts[id]}` : ""}
        </button>
      ))}
    </div>
  );
}
