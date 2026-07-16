"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { INTERESES_CONTACTO } from "@/modules/contacto/validations/contacto.schema";

const fieldClass =
  "w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 transition-colors focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/30";

const labelClass = "grid gap-1.5 text-sm font-semibold text-white/90";

interface FieldErrors {
  nombre?: string;
  email?: string;
  interes?: string;
  mensaje?: string;
  form?: string;
}

export function ContactForm() {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [enviando, setEnviando] = useState(false);
  const [exito, setExito] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({});
    setExito(false);
    setEnviando(true);

    const form = event.currentTarget;
    const data = new FormData(form);

    try {
      const response = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: data.get("nombre"),
          email: data.get("email"),
          interes: data.get("interes"),
          mensaje: data.get("mensaje"),
          website: data.get("website"),
        }),
      });

      const payload = (await response.json()) as {
        ok: boolean;
        errors?: Record<string, string[]>;
        message?: string;
      };

      if (!response.ok) {
        if (payload.errors) {
          setErrors({
            nombre: payload.errors.nombre?.[0],
            email: payload.errors.email?.[0],
            interes: payload.errors.interes?.[0],
            mensaje: payload.errors.mensaje?.[0],
            form: payload.message,
          });
        } else {
          setErrors({ form: payload.message ?? "No se pudo enviar el mensaje." });
        }
        return;
      }

      setExito(true);
      form.reset();
    } catch {
      setErrors({ form: "Error de conexión. Intentá de nuevo en unos segundos." });
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Card className="border-white/10 bg-white/[0.04] p-6 sm:p-8">
      <h2 className="font-display text-lg font-bold uppercase tracking-wide text-white">
        Escribinos
      </h2>
      <p className="mt-1 text-sm text-white/60">
        Consultas, prensa, colaboraciones o para contarnos tu experiencia.
      </p>

      <form
        className="mt-6 grid gap-4"
        onSubmit={handleSubmit}
        noValidate
        aria-describedby={exito ? "contacto-exito" : undefined}
      >
        <label className={labelClass}>
          Nombre
          <input
            type="text"
            name="nombre"
            required
            minLength={2}
            autoComplete="name"
            className={cn(fieldClass, errors.nombre && "border-red-400/80")}
            aria-invalid={Boolean(errors.nombre)}
            aria-describedby={errors.nombre ? "error-nombre" : undefined}
          />
          {errors.nombre ? (
            <span id="error-nombre" className="text-xs font-medium text-red-300">
              {errors.nombre}
            </span>
          ) : null}
        </label>

        <label className={labelClass}>
          Email
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            className={cn(fieldClass, errors.email && "border-red-400/80")}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "error-email" : undefined}
          />
          {errors.email ? (
            <span id="error-email" className="text-xs font-medium text-red-300">
              {errors.email}
            </span>
          ) : null}
        </label>

        <label className={labelClass}>
          ¿Qué te interesa?
          <select
            name="interes"
            required
            defaultValue=""
            className={cn(fieldClass, errors.interes && "border-red-400/80")}
            aria-invalid={Boolean(errors.interes)}
            aria-describedby={errors.interes ? "error-interes" : undefined}
          >
            <option value="" disabled>
              Seleccioná
            </option>
            {INTERESES_CONTACTO.map((opcion) => (
              <option key={opcion} value={opcion} className="bg-brand-ink text-white">
                {opcion}
              </option>
            ))}
          </select>
          {errors.interes ? (
            <span id="error-interes" className="text-xs font-medium text-red-300">
              {errors.interes}
            </span>
          ) : null}
        </label>

        <label className={labelClass}>
          Mensaje
          <textarea
            name="mensaje"
            rows={4}
            required
            minLength={10}
            placeholder="Contanos en pocas palabras…"
            className={cn(fieldClass, "resize-y", errors.mensaje && "border-red-400/80")}
            aria-invalid={Boolean(errors.mensaje)}
            aria-describedby={errors.mensaje ? "error-mensaje" : undefined}
          />
          {errors.mensaje ? (
            <span id="error-mensaje" className="text-xs font-medium text-red-300">
              {errors.mensaje}
            </span>
          ) : null}
        </label>

        {/* Honeypot — oculto para usuarios, visible para bots */}
        <label className="sr-only" aria-hidden="true">
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>

        {errors.form ? (
          <p className="text-sm font-medium text-red-300" role="alert">
            {errors.form}
          </p>
        ) : null}

        <Button type="submit" size="lg" disabled={enviando} className="mt-1 w-full sm:w-auto">
          {enviando ? "Enviando…" : "Enviar mensaje"}
        </Button>

        {exito ? (
          <p
            id="contacto-exito"
            className="text-sm font-semibold text-brand-secondary"
            role="status"
          >
            ¡Gracias! Te responderemos pronto.
          </p>
        ) : null}
      </form>
    </Card>
  );
}
