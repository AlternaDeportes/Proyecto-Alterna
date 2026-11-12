"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { VerifyCodeForm } from "@/modules/autenticacion/components/VerifyCodeForm";

const fieldClass =
  "w-full rounded-xl border border-brand-ink/15 bg-white px-4 py-3 text-sm text-brand-ink placeholder:text-brand-ink/40 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/25";

type Mode = "ingresar" | "crear" | "enlace" | "codigo";

interface EmailAuthFormProps {
  callbackUrl: string;
  databaseReady: boolean;
}

function mapSignInError(code?: string | null, error?: string | null) {
  const key = (code || error || "").toUpperCase();
  if (key.includes("EMAIL_NOT_VERIFIED")) {
    return "Verificá tu email antes de ingresar. Usá el código de 6 dígitos o reenviamos el correo.";
  }
  if (key.includes("TOKEN_INVALID")) {
    return "El enlace no es válido o ya caducó.";
  }
  if (error === "CredentialsSignin" || key.includes("INVALID_CREDENTIALS")) {
    return "Email o contraseña incorrectos.";
  }
  return "No se pudo ingresar. Revisá los datos e intentá de nuevo.";
}

export function EmailAuthForm({ callbackUrl, databaseReady }: EmailAuthFormProps) {
  const [mode, setMode] = useState<Mode>("ingresar");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [devLink, setDevLink] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [needsVerify, setNeedsVerify] = useState(false);
  const [revealCode, setRevealCode] = useState<string | null>(null);

  if (!databaseReady) {
    return (
      <p className="rounded-soft border border-brand-accent/40 bg-brand-accent/10 px-4 py-3 text-sm text-brand-ink/80">
        Para crear una cuenta con email hace falta configurar <code>DATABASE_URL</code>.
      </p>
    );
  }

  function switchMode(next: Mode) {
    setMode(next);
    setError(null);
    setOk(null);
    setDevLink(null);
    setRevealCode(null);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setOk(null);
    setDevLink(null);
    setRevealCode(null);
    setNeedsVerify(false);
    setEnviando(true);

    const form = new FormData(event.currentTarget);
    const emailValue = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    const nombre = String(form.get("nombre") ?? "").trim();
    setEmail(emailValue);

    try {
      if (mode === "crear") {
        const response = await fetch("/api/auth/registro", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre, email: emailValue, password }),
        });
        const payload = (await response.json()) as {
          ok: boolean;
          message?: string;
          alreadyVerified?: boolean;
          verifyUrl?: string;
          verifyCode?: string;
          emailReady?: boolean;
        };
        if (!response.ok || !payload.ok) {
          setError(payload.message ?? "No se pudo crear la cuenta.");
          return;
        }
        if (payload.alreadyVerified) {
          setOk("Listo. Ese email ya estaba verificado. Ahora podés ingresar con tu nueva contraseña.");
          setMode("ingresar");
          return;
        }
        setOk(
          payload.emailReady
            ? "Te enviamos un código de 6 dígitos y un enlace. Revisá la bandeja (y spam)."
            : "Cuenta creada. Ingresá el código de 6 dígitos para verificarla."
        );
        if (payload.verifyUrl) setDevLink(payload.verifyUrl);
        if (payload.verifyCode) setRevealCode(payload.verifyCode);
        setMode("codigo");
        return;
      }

      if (mode === "enlace") {
        const response = await fetch("/api/auth/magic-link", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: emailValue }),
        });
        const payload = (await response.json()) as {
          ok: boolean;
          message?: string;
          magicUrl?: string;
        };
        if (!response.ok || !payload.ok) {
          setError(payload.message ?? "No se pudo enviar el enlace.");
          return;
        }
        setOk("Si el email es válido, te mandamos un enlace para entrar. Caduca en 15 minutos.");
        if (payload.magicUrl) setDevLink(payload.magicUrl);
        return;
      }

      const result = await signIn("credentials", {
        email: emailValue,
        password,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        const message = mapSignInError(result.code, result.error);
        setError(message);
        if ((result.code || result.error || "").includes("EMAIL_NOT_VERIFIED")) {
          setNeedsVerify(true);
        }
        return;
      }

      window.location.assign(result?.url || callbackUrl);
    } catch {
      setError("No se pudo conectar. Intentá de nuevo.");
    } finally {
      setEnviando(false);
    }
  }

  async function resendVerify() {
    setEnviando(true);
    setError(null);
    try {
      const response = await fetch("/api/auth/verificar/reenviar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const payload = (await response.json()) as {
        ok: boolean;
        message?: string;
        verifyUrl?: string;
        verifyCode?: string;
        emailReady?: boolean;
      };
      if (!response.ok || !payload.ok) {
        setError(payload.message ?? "No se pudo reenviar.");
        return;
      }
      setOk(
        payload.emailReady
          ? "Si la cuenta existe y falta verificar, te mandamos un email nuevo."
          : "Generamos un código nuevo. Completalo abajo."
      );
      if (payload.verifyUrl) setDevLink(payload.verifyUrl);
      if (payload.verifyCode) setRevealCode(payload.verifyCode);
      setMode("codigo");
    } catch {
      setError("No se pudo reenviar el email.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-1 rounded-2xl bg-brand-ink/5 p-1 text-xs font-semibold sm:grid-cols-4">
        {(
          [
            ["ingresar", "Ingresar"],
            ["crear", "Crear cuenta"],
            ["enlace", "Enlace"],
            ["codigo", "Código"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => switchMode(id)}
            className={cn(
              "rounded-full px-2 py-2 transition-colors",
              mode === id ? "bg-white text-brand-ink shadow-soft" : "text-brand-ink/55 hover:text-brand-ink"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {mode === "codigo" ? (
        <div className="space-y-3">
          <p className="text-sm text-brand-ink/65">
            El correo trae un código de 6 dígitos y un enlace. Los dos sirven para
            activar la cuenta.
          </p>
          {ok ? (
            <p className="rounded-soft border border-brand-secondary/50 bg-brand-secondary/15 px-4 py-3 text-sm text-brand-ink">
              {ok}
            </p>
          ) : null}
          {revealCode ? (
            <p className="rounded-soft border border-brand-primary/30 bg-brand-primary/10 px-4 py-3 text-center font-display text-2xl tracking-[0.35em] text-brand-ink">
              {revealCode}
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
          <VerifyCodeForm
            key={email}
            initialEmail={email}
            onVerified={() => {
              setOk("Email verificado. Ya podés ingresar.");
              setDevLink(null);
              setRevealCode(null);
              setMode("ingresar");
            }}
          />
          <button
            type="button"
            className="text-sm font-semibold text-brand-primary underline-offset-4 hover:underline"
            onClick={resendVerify}
            disabled={enviando || !email}
          >
            Reenviar código
          </button>
        </div>
      ) : (
        <form className="space-y-3" onSubmit={onSubmit}>
          {mode === "crear" ? (
            <label className="grid gap-1.5 text-sm font-semibold text-brand-ink">
              Nombre
              <input
                name="nombre"
                type="text"
                autoComplete="name"
                required
                minLength={2}
                className={fieldClass}
              />
            </label>
          ) : null}

          <label className="grid gap-1.5 text-sm font-semibold text-brand-ink">
            Email
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              className={fieldClass}
              defaultValue={email}
            />
          </label>

          {mode !== "enlace" ? (
            <label className="grid gap-1.5 text-sm font-semibold text-brand-ink">
              Contraseña
              <input
                name="password"
                type="password"
                autoComplete={mode === "crear" ? "new-password" : "current-password"}
                required
                minLength={8}
                className={fieldClass}
              />
            </label>
          ) : (
            <p className="text-sm text-brand-ink/65">
              Te mandamos un enlace al correo. Sirve para entrar o crear la cuenta sin
              contraseña. El email queda verificado al usarlo.
            </p>
          )}

          {error ? (
            <p className="rounded-soft border border-red-400/40 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
              {error}
            </p>
          ) : null}
          {ok ? (
            <p className="rounded-soft border border-brand-secondary/50 bg-brand-secondary/15 px-4 py-3 text-sm text-brand-ink">
              {ok}
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
            {enviando
              ? "Enviando…"
              : mode === "crear"
                ? "Crear cuenta"
                : mode === "enlace"
                  ? "Enviar enlace"
                  : "Entrar"}
          </Button>
        </form>
      )}

      {needsVerify ? (
        <button
          type="button"
          className="text-sm font-semibold text-brand-primary underline-offset-4 hover:underline"
          onClick={resendVerify}
          disabled={enviando || !email}
        >
          Reenviar código de verificación
        </button>
      ) : null}

      {mode === "ingresar" ? (
        <p className="text-center text-sm text-brand-ink/55">
          <Link href="/recuperar" className="font-semibold text-brand-primary hover:underline">
            ¿Olvidaste tu contraseña?
          </Link>
        </p>
      ) : null}
    </div>
  );
}
