"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { AdminMensajeContacto } from "@/modules/administracion/types";

interface ContactMessagesProps {
  items: AdminMensajeContacto[];
}

export function ContactMessages({ items: initial }: ContactMessagesProps) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function marcarLeido(id: string, leido: boolean) {
    setBusyId(id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/mensajes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leido }),
      });
      const payload = (await res.json()) as { ok: boolean; message?: string };
      if (!res.ok || !payload.ok) {
        setError(payload.message ?? "No se pudo actualizar.");
        return;
      }
      setItems((prev) =>
        prev.map((m) => (m.id === id ? { ...m, leido } : m))
      );
      router.refresh();
    } catch {
      setError("Error de red.");
    } finally {
      setBusyId(null);
    }
  }

  if (!items.length) {
    return <p className="mt-3 text-sm text-white/55">Todavía no hay mensajes de contacto.</p>;
  }

  return (
    <div className="mt-4 space-y-3">
      {error ? <p className="text-sm text-brand-accent">{error}</p> : null}
      {items.map((m) => (
        <article
          key={m.id}
          className={`rounded-xl border px-4 py-4 ${
            m.leido
              ? "border-white/10 bg-white/[0.03] opacity-70"
              : "border-brand-secondary/30 bg-brand-secondary/10"
          }`}
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="font-semibold text-white">
                {m.nombre}{" "}
                <span className="font-normal text-white/50">· {m.interes}</span>
              </h3>
              <a
                href={`mailto:${m.email}`}
                className="mt-1 block text-xs text-brand-secondary hover:underline"
              >
                {m.email}
              </a>
              <p className="mt-2 whitespace-pre-wrap text-sm text-white/75">{m.mensaje}</p>
              <p className="mt-2 text-xs text-white/35">
                {new Date(m.createdAt).toLocaleString("es-AR")}
              </p>
            </div>
            <Button
              type="button"
              size="sm"
              variant={m.leido ? "outline" : "secondary"}
              disabled={busyId === m.id}
              onClick={() => void marcarLeido(m.id, !m.leido)}
            >
              {m.leido ? "Marcar no leído" : "Marcar leído"}
            </Button>
          </div>
        </article>
      ))}
    </div>
  );
}
