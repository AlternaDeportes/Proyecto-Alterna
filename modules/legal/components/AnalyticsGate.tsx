"use client";

import { useEffect, useState } from "react";
import {
  hasAnalyticsConsent,
  readConsent,
  type CookieConsent,
} from "@/modules/legal/consent";

/**
 * Placeholder de analytics post-consentimiento.
 * Cuando haya Plausible/GA, inyectar el script solo si `analytics === true`.
 */
export function AnalyticsGate() {
  const [consent, setConsent] = useState<CookieConsent | null>(null);

  useEffect(() => {
    setConsent(readConsent());

    function onConsent(event: Event) {
      const detail = (event as CustomEvent<CookieConsent>).detail;
      setConsent(detail);
    }

    window.addEventListener("alterna:consent", onConsent);
    return () => window.removeEventListener("alterna:consent", onConsent);
  }, []);

  useEffect(() => {
    if (!hasAnalyticsConsent(consent)) return;

    // Hook listo para provider real (Plausible / GA).
    // No cargamos scripts de terceros hasta configurar IDs.
    if (process.env.NODE_ENV === "development") {
      console.info("[analytics] Consentimiento analítico activo (sin script aún).");
    }
  }, [consent]);

  return null;
}
