"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";

interface ComentarioItem {
  id: string;
  texto: string;
  createdAt: string;
  moderacion?: string;
  usuario: { nombre: string };
}

interface LocationCommentsProps {
  ubicacionId: string;
}

export function LocationComments({ ubicacionId }: LocationCommentsProps) {
  const { data: session } = useSession();
  const [comentarios, setComentarios] = useState<ComentarioItem[]>([]);
  const [texto, setTexto] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [pendiente, setPendiente] = useState(false);

  const cargar = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/comunidad/comentarios?ubicacionId=${encodeURIComponent(ubicacionId)}`
      );
      const payload = (await res.json()) as { ok: boolean; data?: ComentarioItem[] };
      if (payload.ok && payload.data) setComentarios(payload.data);
    } catch {
      /* silencioso en mapa */
    }
  }, [ubicacionId]);

  useEffect(() => {
    void cargar();
  }, [cargar]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setPendiente(false);
    setEnviando(true);
    try {
      const res = await fetch("/api/comunidad/comentarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ubicacionId, texto }),
      });
      const payload = (await res.json()) as { ok: boolean; message?: string; data?: ComentarioItem };
      if (!res.ok) {
        setError(payload.message ?? "No se pudo publicar.");
        return;
      }
      if (payload.data?.moderacion === "PENDIENTE") {
        setPendiente(true);
      } else if (payload.data) {
        setComentarios((prev) => [payload.data!, ...prev]);
      }
      setTexto("");
    } catch {
      setError("Error de conexión.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="mt-3 border-t border-brand-ink/10 pt-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-brand-ink/55">
        Comentarios
      </p>

      {comentarios.length === 0 ? (
        <p className="mt-1 text-xs text-brand-ink/50">Todavía no hay comentarios.</p>
      ) : (
        <ul className="mt-2 max-h-28 space-y-2 overflow-y-auto">
          {comentarios.map((c) => (
            <li key={c.id} className="text-xs text-brand-ink/75">
              <strong className="text-brand-ink">{c.usuario.nombre}</strong>: {c.texto}
            </li>
          ))}
        </ul>
      )}

      {session?.user ? (
        <form onSubmit={handleSubmit} className="mt-2 space-y-2">
          <textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            rows={2}
            minLength={3}
            maxLength={500}
            required
            placeholder="Escribí un comentario…"
            className="w-full rounded-lg border border-brand-ink/15 px-2 py-1.5 text-xs text-brand-ink focus:border-brand-primary focus:outline-none"
          />
          {error ? (
            <p className="text-xs text-red-600" role="alert">
              {error}
            </p>
          ) : null}
          {pendiente ? (
            <p className="text-xs text-brand-ink/60">
              Gracias. Tu comentario queda en revisión y se publica si el equipo lo aprueba.
            </p>
          ) : null}
          <Button type="submit" size="sm" variant="primary" disabled={enviando} className="w-full">
            {enviando ? "Publicando…" : "Comentar"}
          </Button>
        </form>
      ) : (
        <Link
          href={`/ingresar?callbackUrl=${encodeURIComponent("/mapa")}`}
          className="mt-2 inline-block text-xs font-semibold text-brand-primary hover:underline"
        >
          Ingresá para comentar →
        </Link>
      )}
    </div>
  );
}
