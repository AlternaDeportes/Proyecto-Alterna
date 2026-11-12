"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";

const fieldClass =
  "w-full rounded-xl border border-brand-ink/15 bg-white px-4 py-3 text-sm text-brand-ink placeholder:text-brand-ink/40 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/25";

interface VerifyCodeFormProps {
  initialEmail?: string;
  onVerified?: () => void;
}

export function VerifyCodeForm({ initialEmail = "", onVerified }: VerifyCodeFormProps) {
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setEnviando(true);

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const code = String(form.get("code") ?? "").replace(/\s/g, "");

    try {
      const response = await fetch("/api/auth/verificar/codigo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const payload = (await response.json()) as { ok: boolean; message?: string };
      if (!response.ok || !payload.ok) {
        setError(payload.message ?? "No se pudo verificar el código.");
        return;
      }
      if (onVerified) {
        onVerified();
        return;
      }
      window.location.assign("/ingresar");
    } catch {
      setError("No se pudo conectar. Intentá de nuevo.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form className="space-y-3" onSubmit={onSubmit}>
      <label className="grid gap-1.5 text-sm font-semibold text-brand-ink">
        Email
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          defaultValue={initialEmail}
          className={fieldClass}
        />
      </label>
      <label className="grid gap-1.5 text-sm font-semibold text-brand-ink">
        Código de 6 dígitos
        <input
          name="code"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          required
          pattern="\d{6}"
          maxLength={6}
          className={`${fieldClass} tracking-[0.4em]`}
        />
      </label>
      {error ? (
        <p className="rounded-soft border border-red-400/40 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
      <Button type="submit" variant="primary" size="lg" className="w-full" disabled={enviando}>
        {enviando ? "Verificando…" : "Verificar cuenta"}
      </Button>
    </form>
  );
}
