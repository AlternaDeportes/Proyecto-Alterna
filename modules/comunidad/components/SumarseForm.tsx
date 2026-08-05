"use client";

import { useSession } from "next-auth/react";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { MOTIVOS_SUMARSE } from "@/modules/comunidad/validations/comunidad.schema";

const fieldClass =
  "w-full rounded-xl border border-brand-ink/15 bg-white px-4 py-3 text-sm text-brand-ink placeholder:text-brand-ink/40 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/25";

export function SumarseForm() {
  const { data: session } = useSession();
  const [enviando, setEnviando] = useState(false);
  const [exito, setExito] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setExito(false);
    setEnviando(true);

    const form = event.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/comunidad/sumarse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: data.get("nombre"),
          email: data.get("email"),
          motivo: data.get("motivo"),
          mensaje: data.get("mensaje"),
          deporteSlug: data.get("deporteSlug") || "",
          website: data.get("website"),
        }),
      });
      const payload = (await res.json()) as { ok: boolean; message?: string };
      if (!res.ok) {
        setError(payload.message ?? "No se pudo enviar.");
        return;
      }
      setExito(true);
      form.reset();
    } catch {
      setError("Error de conexión. Intentá de nuevo.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Card id="sumarse" surface="paper" className="scroll-mt-24 p-6 sm:p-8">
      <h2 className="font-display text-lg font-bold uppercase tracking-wide text-brand-ink">
        Sumate a la comunidad
      </h2>
      <p className="mt-1 text-sm text-brand-ink/60">
        Contanos cómo querés participar. No hace falta estar logueado para este mensaje.
      </p>

      <form className="mt-6 grid gap-4" onSubmit={handleSubmit} noValidate>
        <label className="grid gap-1.5 text-sm font-semibold text-brand-ink">
          Nombre
          <input
            name="nombre"
            required
            minLength={2}
            defaultValue={session?.user?.name ?? ""}
            className={fieldClass}
            autoComplete="name"
          />
        </label>
        <label className="grid gap-1.5 text-sm font-semibold text-brand-ink">
          Email
          <input
            name="email"
            type="email"
            required
            defaultValue={session?.user?.email ?? ""}
            className={fieldClass}
            autoComplete="email"
          />
        </label>
        <label className="grid gap-1.5 text-sm font-semibold text-brand-ink">
          Motivo
          <select name="motivo" required defaultValue="" className={fieldClass}>
            <option value="" disabled>
              Seleccioná
            </option>
            {MOTIVOS_SUMARSE.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1.5 text-sm font-semibold text-brand-ink">
          Deporte (opcional)
          <select name="deporteSlug" defaultValue="" className={fieldClass}>
            <option value="">Ninguno en particular</option>
            <option value="ultimate-frisbee">
              Ultimate Frisbee
            </option>
            <option value="newcom">
              Newcom
            </option>
            <option value="wingfoil">
              Wingfoil
            </option>
          </select>
        </label>
        <label className="grid gap-1.5 text-sm font-semibold text-brand-ink">
          Mensaje
          <textarea
            name="mensaje"
            rows={4}
            required
            minLength={10}
            placeholder="Contanos en pocas palabras…"
            className={cn(fieldClass, "resize-y")}
          />
        </label>
        <label className="sr-only" aria-hidden>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>

        {error ? (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        ) : null}
        {exito ? (
          <p className="text-sm font-semibold text-brand-primary" role="status">
            ¡Gracias! Te vamos a contactar pronto.
          </p>
        ) : null}

        <Button type="submit" size="lg" disabled={enviando} className="w-full sm:w-auto">
          {enviando ? "Enviando…" : "Enviar"}
        </Button>
      </form>
    </Card>
  );
}
