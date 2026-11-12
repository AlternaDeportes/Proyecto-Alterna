"use client";

import { useState, type FormEvent } from "react";
import { Button, ButtonLink } from "@/components/ui/button";

const fieldClass =
  "w-full rounded-xl border border-brand-ink/15 bg-white px-4 py-3 text-sm text-brand-ink placeholder:text-brand-ink/40 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/25";

interface ResetPasswordFormProps {
  token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setEnviando(true);
    const password = String(new FormData(event.currentTarget).get("password") ?? "");

    try {
      const response = await fetch("/api/auth/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const payload = (await response.json()) as { ok: boolean; message?: string };
      if (!response.ok || !payload.ok) {
        setError(payload.message ?? "No se pudo cambiar la contraseña.");
        return;
      }
      setOk(true);
    } catch {
      setError("No se pudo conectar.");
    } finally {
      setEnviando(false);
    }
  }

  if (ok) {
    return (
      <div className="space-y-4">
        <p className="rounded-soft border border-brand-secondary/50 bg-brand-secondary/15 px-4 py-3 text-sm text-brand-ink">
          Contraseña actualizada. Ya podés ingresar.
        </p>
        <ButtonLink href="/ingresar" variant="primary">
          Ir a ingresar
        </ButtonLink>
      </div>
    );
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <label className="grid gap-1.5 text-sm font-semibold text-brand-ink">
        Nueva contraseña
        <input
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className={fieldClass}
        />
      </label>
      {error ? (
        <p className="rounded-soft border border-red-400/40 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
      <Button type="submit" variant="primary" size="lg" className="w-full" disabled={enviando}>
        {enviando ? "Guardando…" : "Guardar contraseña"}
      </Button>
    </form>
  );
}
