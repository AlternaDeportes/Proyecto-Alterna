"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useMemo, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MAP_CIUDADES, MAP_REGION, OTROS_SPORT_SLUG } from "@/config/map-region";
import { cn } from "@/lib/utils";

const fieldClass =
  "w-full rounded-xl border border-brand-ink/15 bg-white px-4 py-3 text-sm text-brand-ink placeholder:text-brand-ink/40 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/25";

export function ProposeLocationForm() {
  const { data: session, status } = useSession();
  const [enviando, setEnviando] = useState(false);
  const [exito, setExito] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ciudadSlug, setCiudadSlug] = useState<string>(MAP_CIUDADES[0].slug);
  const [deporteSlug, setDeporteSlug] = useState("");
  const ciudad = useMemo(
    () => MAP_CIUDADES.find((c) => c.slug === ciudadSlug) ?? MAP_CIUDADES[0],
    [ciudadSlug]
  );

  if (status === "loading") {
    return (
      <Card surface="paper" className="p-6">
        <p className="text-sm text-brand-ink/50">Cargando sesión…</p>
      </Card>
    );
  }

  if (!session?.user) {
    return (
      <Card id="sumar-punto" surface="paper" className="scroll-mt-24 p-6 sm:p-8">
        <h2 className="font-display text-lg font-bold uppercase text-brand-ink">
          Sumar un punto al mapa
        </h2>
        <p className="mt-2 text-sm text-brand-ink/65">
          Para proponer un lugar de práctica necesitás iniciar sesión con Google. El punto
          queda pendiente de aprobación. Ultimate, Newcom y Wingfoil son el proyecto; otros
          deportes solo suman como punto en el mapa (Santa Fe y alrededores, hasta{" "}
          {MAP_REGION.radiusKm} km).
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
          ciudadSlug: data.get("ciudadSlug"),
          deporteSlug: data.get("deporteSlug"),
          deporteOtroNombre: data.get("deporteOtroNombre"),
        }),
      });
      const payload = (await res.json()) as { ok: boolean; message?: string };
      if (!res.ok) {
        setError(payload.message ?? "No se pudo enviar el punto.");
        return;
      }
      setExito(payload.message ?? "Punto enviado a moderación.");
      form.reset();
      setCiudadSlug(MAP_CIUDADES[0].slug);
      setDeporteSlug("");
    } catch {
      setError("Error de conexión.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Card id="sumar-punto" surface="paper" className="scroll-mt-24 p-6 sm:p-8">
      <h2 className="font-display text-lg font-bold uppercase text-brand-ink">
        Sumar un punto al mapa
      </h2>
      <p className="mt-1 text-sm text-brand-ink/60">
        Hola {session.user.name?.split(" ")[0]}. Tu aporte queda en revisión antes de
        publicarse.
      </p>

      <ul className="mt-4 list-disc space-y-1 pl-5 text-xs text-brand-ink/55">
        <li>El lugar tiene que ser real y verificable (nombre + dirección).</li>
        <li>
          El proyecto transmedia es Ultimate, Newcom y Wingfoil. Podés sumar{" "}
          <strong className="font-semibold text-brand-ink/70">otro deporte</strong> solo
          como punto en el mapa (sin podcast, documental ni ficha propia).
        </li>
        <li>
          Solo dentro de ~{MAP_REGION.radiusKm} km de Santa Fe (Paraná, Santo Tomé, etc.).
        </li>
        <li>Sin datos personales de terceros sin permiso, spam ni contenido ofensivo.</li>
        <li>ALTERNA puede editar, rechazar o quitar el punto.</li>
      </ul>

      <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
        <label className="grid gap-1.5 text-sm font-semibold text-brand-ink sm:col-span-2">
          Nombre del lugar
          <input name="nombre" required minLength={2} className={fieldClass} />
        </label>
        <label className="grid gap-1.5 text-sm font-semibold text-brand-ink sm:col-span-2">
          Dirección
          <input name="direccion" required minLength={4} className={fieldClass} />
        </label>
        <label className="grid gap-1.5 text-sm font-semibold text-brand-ink">
          Ciudad
          <select
            name="ciudadSlug"
            required
            value={ciudadSlug}
            onChange={(e) => setCiudadSlug(e.target.value)}
            className={fieldClass}
          >
            {MAP_CIUDADES.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.nombre}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1.5 text-sm font-semibold text-brand-ink">
          Deporte
          <select
            name="deporteSlug"
            required
            value={deporteSlug}
            onChange={(e) => setDeporteSlug(e.target.value)}
            className={fieldClass}
          >
            <option value="" disabled>
              Seleccioná
            </option>
            <option value="ultimate-frisbee">Ultimate Frisbee</option>
            <option value="newcom">Newcom</option>
            <option value="wingfoil">Wingfoil</option>
            <option value={OTROS_SPORT_SLUG}>Otro deporte (solo mapa)</option>
          </select>
        </label>
        {deporteSlug === OTROS_SPORT_SLUG ? (
          <label className="grid gap-1.5 text-sm font-semibold text-brand-ink sm:col-span-2">
            ¿Cuál deporte?
            <input
              name="deporteOtroNombre"
              required
              minLength={2}
              maxLength={80}
              placeholder="Ej. Skate, Kayak, Capoeira…"
              className={fieldClass}
            />
          </label>
        ) : (
          <input type="hidden" name="deporteOtroNombre" value="" />
        )}
        <label className="grid gap-1.5 text-sm font-semibold text-brand-ink">
          Latitud
          <input
            name="lat"
            type="number"
            step="any"
            required
            key={`lat-${ciudad.slug}`}
            defaultValue={ciudad.lat}
            className={fieldClass}
          />
        </label>
        <label className="grid gap-1.5 text-sm font-semibold text-brand-ink">
          Longitud
          <input
            name="lng"
            type="number"
            step="any"
            required
            key={`lng-${ciudad.slug}`}
            defaultValue={ciudad.lng}
            className={fieldClass}
          />
        </label>
        <label className="grid gap-1.5 text-sm font-semibold text-brand-ink sm:col-span-2">
          Horarios
          <input
            name="horarios"
            required
            placeholder="Ej. Lun y jue 20:00"
            className={fieldClass}
          />
        </label>
        <label className="grid gap-1.5 text-sm font-semibold text-brand-ink sm:col-span-2">
          Contacto (opcional)
          <input name="contacto" className={fieldClass} placeholder="@grupo o email" />
        </label>
        <label className="grid gap-1.5 text-sm font-semibold text-brand-ink sm:col-span-2">
          Breve historia (opcional)
          <textarea name="historia" rows={3} className={cn(fieldClass, "resize-y")} />
        </label>

        {error ? (
          <p className="text-sm text-red-600 sm:col-span-2" role="alert">
            {error}
          </p>
        ) : null}
        {exito ? (
          <p className="text-sm font-semibold text-brand-primary sm:col-span-2" role="status">
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

