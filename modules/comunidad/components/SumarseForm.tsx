"use client";

import { useSession } from "next-auth/react";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { MOTIVOS_SUMARSE } from "@/modules/comunidad/validations/comunidad.schema";

const fieldClass =
  "w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/30";

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
    <Card id="sumarse" className="scroll-mt-24 border-white/10 bg-white/[0.04] p-6 sm:p-8">
      <h2 className="font-display text-lg font-bold uppercase tracking-wide text-white">
        Sumate a la comunidad
      </h2>
      <p className="mt-1 text-sm text-white/60">
        Contanos cómo querés participar. No hace falta estar logueado para este mensaje.
      </p>

      <form className="mt-6 grid gap-4" onSubmit={handleSubmit} noValidate>
        <label className="grid gap-1.5 text-sm font-semibold text-white/90">
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
        <label className="grid gap-1.5 text-sm font-semibold text-white/90">
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
        <label className="grid gap-1.5 text-sm font-semibold text-white/90">
          Motivo
          <select name="motivo" required defaultValue="" className={fieldClass}>
            <option value="" disabled>
              Seleccioná
            </option>
            {MOTIVOS_SUMARSE.map((m) => (
              <option key={m} value={m} className="bg-brand-ink">
                {m}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1.5 text-sm font-semibold text-white/90">
          Deporte (opcional)
          <select name="deporteSlug" defaultValue="" className={fieldClass}>
            <option value="">Ninguno en particular</option>
            <option value="ultimate-frisbee" className="bg-brand-ink">
              Ultimate Frisbee
            </option>
            <option value="newcom" className="bg-brand-ink">
              Newcom
            </option>
            <option value="wingfoil" className="bg-brand-ink">
              Wingfoil
            </option>
          </select>
        </label>
        <label className="grid gap-1.5 text-sm font-semibold text-white/90">
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
          <p className="text-sm text-red-300" role="alert">
            {error}
          </p>
        ) : null}
        {exito ? (
          <p className="text-sm font-semibold text-brand-secondary" role="status">
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
