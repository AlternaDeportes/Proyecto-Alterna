"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type Campo = {
  key: string;
  label: string;
  value: string;
  kind: "text" | "textarea" | "number" | "checkbox" | "select";
  options?: { value: string; label: string }[];
};

type Ficha = {
  tipo: string;
  id: string;
  titulo: string;
  campos: Campo[];
};

const fieldClass =
  "w-full rounded-xl border border-brand-ink/15 bg-white px-3 py-2 text-sm text-brand-ink focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/25";

interface AdminEditorProps {
  tipo: string;
  id: string;
  onClose: () => void;
}

export function AdminEditor({ tipo, id, onClose }: AdminEditorProps) {
  const [ficha, setFicha] = useState<Ficha | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);
  useEffect(() => {
    let activo = true;
    setCargando(true);
    setError(null);
    fetch(`/api/admin/editar?tipo=${tipo}&id=${id}`)
      .then(async (response) => {
        const payload = (await response.json()) as { ok: boolean; message?: string; ficha?: Ficha };
        if (!activo) return;
        if (!response.ok || !payload.ok || !payload.ficha) {
          setError(payload.message ?? "No se pudo abrir la ficha.");
          return;
        }
        setFicha(payload.ficha);
        setValues(Object.fromEntries(payload.ficha.campos.map((campo) => [campo.key, campo.value])));
      })
      .catch(() => {
        if (activo) setError("No se pudo abrir la ficha.");
      })
      .finally(() => {
        if (activo) setCargando(false);
      });
    return () => {
      activo = false;
    };
  }, [tipo, id]);

  async function guardar() {
    if (!ficha) return;
    setCargando(true);
    setError(null);
    setOk(null);
    try {
      const response = await fetch("/api/admin/editar", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipo: ficha.tipo, id: ficha.id, values }),
      });
      const payload = (await response.json()) as { ok: boolean; message?: string; ficha?: Ficha };
      if (!response.ok || !payload.ok || !payload.ficha) {
        setError(payload.message ?? "No se pudo guardar.");
        return;
      }
      setFicha(payload.ficha);
      setValues(Object.fromEntries(payload.ficha.campos.map((campo) => [campo.key, campo.value])));
      setOk("Guardado. Ya se ve en la página.");
    } catch {
      setError("No se pudo guardar.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="mt-3 rounded-2xl border border-brand-ink/10 bg-brand-surface p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="font-display text-sm font-bold uppercase text-brand-ink">
          {ficha?.titulo ?? "Editar"}
        </p>
        <button type="button" className="text-xs font-semibold text-brand-ink/50" onClick={onClose}>
          Cerrar
        </button>
      </div>
      {cargando && !ficha ? <p className="mt-3 text-sm text-brand-ink/55">Cargando…</p> : null}
      {error ? (
        <p className="mt-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
      {ficha ? (
        <div className="mt-3 grid gap-3">
          {ficha.campos.map((campo) => (
            <label key={campo.key} className="grid gap-1 text-sm font-semibold text-brand-ink">
              {campo.label}
              {campo.kind === "textarea" ? (
                <textarea
                  rows={4}
                  className={fieldClass}
                  value={values[campo.key] ?? ""}
                  onChange={(event) =>
                    setValues((prev) => ({ ...prev, [campo.key]: event.target.value }))
                  }
                />
              ) : campo.kind === "select" ? (
                <select
                  className={fieldClass}
                  value={values[campo.key] ?? ""}
                  onChange={(event) =>
                    setValues((prev) => ({ ...prev, [campo.key]: event.target.value }))
                  }
                >
                  {campo.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : campo.kind === "checkbox" ? (
                <input
                  type="checkbox"
                  className="h-4 w-4"
                  checked={values[campo.key] === "true"}
                  onChange={(event) =>
                    setValues((prev) => ({
                      ...prev,
                      [campo.key]: event.target.checked ? "true" : "false",
                    }))
                  }
                />
              ) : (
                <input
                  type={campo.kind === "number" ? "number" : "text"}
                  className={fieldClass}
                  value={values[campo.key] ?? ""}
                  onChange={(event) =>
                    setValues((prev) => ({ ...prev, [campo.key]: event.target.value }))
                  }
                />
              )}
            </label>
          ))}
          {ok ? <p className="text-sm text-brand-ink/70">{ok}</p> : null}
          <Button type="button" onClick={guardar} disabled={cargando}>
            {cargando ? "Guardando…" : "Guardar"}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
