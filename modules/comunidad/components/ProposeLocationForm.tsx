"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { SANTA_FE_CENTER } from "@/modules/mapa/types";

const fieldClass =
  "w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/30";

export function ProposeLocationForm() {
  const { data: session, status } = useSession();
  const [enviando, setEnviando] = useState(false);
  const [exito, setExito] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (status === "loading") {
    return (
      <Card className="border-white/10 bg-white/[0.04] p-6">
        <p className="text-sm text-white/50">Cargando sesión…</p>
      </Card>
    );
  }

  if (!session?.user) {
    return (
      <Card
        id="sumar-punto"
        className="scroll-mt-24 border-white/10 bg-white/[0.04] p-6 sm:p-8"
      >
        <h2 className="font-display text-lg font-bold uppercase text-white">
          Sumar un punto al mapa
        </h2>
        <p className="mt-2 text-sm text-white/65">
          Para proponer un lugar de práctica necesitás iniciar sesión con Google. El punto
          queda pendiente de aprobación.
        </p>
        <Link
          href="/ingresar?callbackUrl=/comunidad%23sumar-punto"
          className="mt-5 inline-flex h-11 items-center rounded-full bg-brand-secondary px-6 text-sm font-semibold text-brand-ink"
        >
          Ingresar con Google
        </Link>
      </Card>
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setExito(null);
    setEnviando(true);
    const form = event.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/comunidad/ubicaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: data.get("nombre"),
          direccion: data.get("direccion"),
          lat: data.get("lat"),
          lng: data.get("lng"),
          horarios: data.get("horarios"),
          contacto: data.get("contacto"),
          historia: data.get("historia"),
          deporteSlug: data.get("deporteSlug"),
        }),
      });
      const payload = (await res.json()) as { ok: boolean; message?: string };
      if (!res.ok) {
        setError(payload.message ?? "No se pudo enviar el punto.");
        return;
      }
      setExito(payload.message ?? "Punto enviado a moderación.");
      form.reset();
    } catch {
      setError("Error de conexión.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Card
      id="sumar-punto"
      className="scroll-mt-24 border-white/10 bg-white/[0.04] p-6 sm:p-8"
    >
      <h2 className="font-display text-lg font-bold uppercase text-white">
        Sumar un punto al mapa
      </h2>
      <p className="mt-1 text-sm text-white/60">
        Hola {session.user.name?.split(" ")[0]}. Tu aporte queda en revisión antes de
        publicarse.
      </p>

      <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
        <label className="grid gap-1.5 text-sm font-semibold text-white/90 sm:col-span-2">
          Nombre del lugar
          <input name="nombre" required minLength={2} className={fieldClass} />
        </label>
        <label className="grid gap-1.5 text-sm font-semibold text-white/90 sm:col-span-2">
          Dirección
          <input name="direccion" required minLength={4} className={fieldClass} />
        </label>
        <label className="grid gap-1.5 text-sm font-semibold text-white/90">
          Latitud
          <input
            name="lat"
            type="number"
            step="any"
            required
            defaultValue={SANTA_FE_CENTER.lat}
            className={fieldClass}
          />
        </label>
        <label className="grid gap-1.5 text-sm font-semibold text-white/90">
          Longitud
          <input
            name="lng"
            type="number"
            step="any"
            required
            defaultValue={SANTA_FE_CENTER.lng}
            className={fieldClass}
          />
        </label>
        <label className="grid gap-1.5 text-sm font-semibold text-white/90">
          Horarios
          <input
            name="horarios"
            required
            placeholder="Ej. Lun y jue 20:00"
            className={fieldClass}
          />
        </label>
        <label className="grid gap-1.5 text-sm font-semibold text-white/90">
          Deporte
          <select name="deporteSlug" required defaultValue="" className={fieldClass}>
            <option value="" disabled>
              Seleccioná
            </option>
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
        <label className="grid gap-1.5 text-sm font-semibold text-white/90 sm:col-span-2">
          Contacto (opcional)
          <input name="contacto" className={fieldClass} placeholder="@grupo o email" />
        </label>
        <label className="grid gap-1.5 text-sm font-semibold text-white/90 sm:col-span-2">
          Breve historia (opcional)
          <textarea name="historia" rows={3} className={cn(fieldClass, "resize-y")} />
        </label>

        {error ? (
          <p className="text-sm text-red-300 sm:col-span-2" role="alert">
            {error}
          </p>
        ) : null}
        {exito ? (
          <p className="text-sm font-semibold text-brand-secondary sm:col-span-2" role="status">
            {exito}
          </p>
        ) : null}

        <div className="sm:col-span-2">
          <Button type="submit" size="lg" disabled={enviando}>
            {enviando ? "Enviando…" : "Enviar a moderación"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
