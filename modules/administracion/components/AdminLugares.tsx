"use client";

import { useEffect, useState } from "react";
import { AdminEditor } from "@/modules/administracion/components/AdminEditor";

type Lugar = {
  id: string;
  titulo: string;
  meta: string;
};

export function AdminLugares() {
  const [lugares, setLugares] = useState<Lugar[]>([]);
  const [abierto, setAbierto] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let activo = true;
    fetch("/api/admin/editar?tipo=ubicaciones")
      .then(async (response) => {
        const payload = (await response.json()) as {
          ok: boolean;
          message?: string;
          lugares?: Lugar[];
        };
        if (!activo) return;
        if (!response.ok || !payload.ok) {
          setError(payload.message ?? "No se pudieron cargar los lugares.");
          return;
        }
        setLugares(payload.lugares ?? []);
      })
      .catch(() => {
        if (activo) setError("No se pudieron cargar los lugares.");
      });
    return () => {
      activo = false;
    };
  }, []);

  return (
    <section>
      <h3 className="font-display text-sm font-bold uppercase text-brand-ink">Lugares del mapa</h3>
      <p className="mt-1 text-sm text-brand-ink/55">
        Nombre, dirección y horarios de los clubes. Los cambios salen en el mapa.
      </p>
      {error ? <p className="mt-2 text-sm text-red-700">{error}</p> : null}
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {lugares.map((lugar) => (
          <li key={lugar.id} className="rounded-xl border border-brand-ink/10 bg-white px-4 py-3 text-sm shadow-soft">
            <div className="flex items-center justify-between gap-3">
              <span>
                <span className="font-semibold text-brand-ink">{lugar.titulo}</span>
                <span className="mt-0.5 block text-xs text-brand-ink/40">{lugar.meta}</span>
              </span>
              <button
                type="button"
                className="text-xs font-semibold text-brand-ink"
                onClick={() => setAbierto(lugar.id)}
              >
                Editar
              </button>
            </div>
            {abierto === lugar.id ? (
              <AdminEditor tipo="ubicacion" id={lugar.id} onClose={() => setAbierto(null)} />
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
