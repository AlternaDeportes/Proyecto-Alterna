"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  createConsent,
  hasAnalyticsConsent,
  readConsent,
  writeConsent,
  type CookieConsent,
} from "@/modules/legal/consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [consent, setConsent] = useState<CookieConsent | null>(null);

  useEffect(() => {
    const existing = readConsent();
    setConsent(existing);
    setVisible(!existing);
  }, []);

  function decide(analytics: boolean) {
    const next = createConsent(analytics);
    writeConsent(next);
    setConsent(next);
    setVisible(false);
  }

  if (!visible) {
    return (
      <ConsentStatusBar
        consent={consent}
        onOpen={() => setVisible(true)}
      />
    );
  }

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-desc"
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-white/15 bg-brand-ink/95 p-4 shadow-2xl backdrop-blur-md sm:p-5"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <h2
            id="cookie-banner-title"
            className="font-display text-sm font-bold uppercase tracking-wide text-white"
          >
            Cookies y privacidad
          </h2>
          <p id="cookie-banner-desc" className="mt-2 text-sm text-white/70">
            Usamos cookies necesarias para que el sitio funcione. Las analíticas solo se
            activan si las aceptás. Podés cambiar tu elección cuando quieras. Más info en{" "}
            <Link href="/cookies" className="font-semibold text-brand-secondary hover:underline">
              Política de cookies
            </Link>
            .
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => decide(false)}>
            Solo necesarias
          </Button>
          <Button type="button" variant="secondary" size="sm" onClick={() => decide(true)}>
            Aceptar todas
          </Button>
        </div>
      </div>
    </div>
  );
}

function ConsentStatusBar({
  consent,
  onOpen,
}: {
  consent: CookieConsent | null;
  onOpen: () => void;
}) {
  if (!consent) return null;

  return (
    <div className="fixed bottom-3 right-3 z-[55] hidden sm:block">
      <button
        type="button"
        onClick={onOpen}
        className="rounded-full border border-white/20 bg-brand-ink/90 px-3 py-1.5 text-[11px] font-semibold text-white/70 backdrop-blur hover:text-white"
        aria-label="Cambiar preferencias de cookies"
      >
        Cookies: {hasAnalyticsConsent(consent) ? "todas" : "necesarias"}
      </button>
    </div>
  );
}
