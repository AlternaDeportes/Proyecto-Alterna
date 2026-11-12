"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";

const fieldClass =
  "w-full rounded-xl border border-brand-ink/15 bg-white px-4 py-3 text-sm text-brand-ink placeholder:text-brand-ink/40 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/25";

export function RecuperarForm() {
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [devLink, setDevLink] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setOk(false);
    setDevLink(null);
    setEnviando(true);
    const email = String(new FormData(event.currentTarget).get("email") ?? "");

    try {
      const response = await fetch("/api/auth/recuperar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const payload = (await response.json()) as {
        ok: boolean;
        message?: string;
        resetUrl?: string;
      };
      if (!response.ok || !payload.ok) {
        setError(payload.message ?? "No se pudo enviar el email.");
        return;
      }
      setOk(true);
      if (payload.resetUrl) setDevLink(payload.resetUrl);
    } catch {
      setError("No se pudo conectar.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <label className="grid gap-1.5 text-sm font-semibold text-brand-ink">
        Email
        <input name="email" type="email" required autoComplete="email" className={fieldClass} />
      </label>
      {error ? (
        <p className="rounded-soft border border-red-400/40 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
      {ok ? (
        <p className="rounded-soft border border-brand-secondary/50 bg-brand-secondary/15 px-4 py-3 text-sm text-brand-ink">
          Si hay una cuenta con ese email, te mandamos un enlace para elegir una contraseña nueva.
        </p>
      ) : null}
      {devLink ? (
        <p className="break-all text-xs text-brand-ink/55">
          Desarrollo:{" "}
          <a href={devLink} className="underline">
            {devLink}
          </a>
        </p>
      ) : null}
      <Button type="submit" variant="primary" size="lg" className="w-full" disabled={enviando}>
        {enviando ? "Enviando…" : "Enviar enlace"}
      </Button>
    </form>
  );
}
