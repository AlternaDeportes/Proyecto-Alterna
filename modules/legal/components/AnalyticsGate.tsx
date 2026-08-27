"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { sendPageView } from "@/modules/analytics/tracker";
import {
  hasAnalyticsConsent,
  readConsent,
  type CookieConsent,
} from "@/modules/legal/consent";

/**
 * Analytics first-party post-consentimiento.
 * Mide páginas vistas anónimas (sin IP ni user id) y queda listo para Plausible/GA.
 */
export function AnalyticsGate() {
  const pathname = usePathname();
  const [consent, setConsent] = useState<CookieConsent | null>(null);
  const lastPath = useRef<string | null>(null);

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
    if (!pathname || lastPath.current === pathname) return;
    lastPath.current = pathname;
    void sendPageView(pathname, document.referrer);
  }, [consent, pathname]);

  return null;
}
