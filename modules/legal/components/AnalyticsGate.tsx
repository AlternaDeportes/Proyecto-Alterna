"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { sendEngagement, sendPageView } from "@/modules/analytics/tracker";
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

  useEffect(() => {
    if (!hasAnalyticsConsent(consent) || !pathname) return;

    const started = performance.now();
    let maxScroll = 0;

    const measureScroll = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      const pct =
        scrollable <= 0 ? 100 : Math.round((window.scrollY / scrollable) * 100);
      maxScroll = Math.max(maxScroll, Math.min(100, pct));
    };

    const flush = () => {
      sendEngagement(pathname, Math.round(performance.now() - started), maxScroll);
    };

    measureScroll();
    const onHide = () => {
      if (document.visibilityState === "hidden") flush();
    };
    window.addEventListener("scroll", measureScroll, { passive: true });
    document.addEventListener("visibilitychange", onHide);

    return () => {
      flush();
      window.removeEventListener("scroll", measureScroll);
      document.removeEventListener("visibilitychange", onHide);
    };
  }, [consent, pathname]);

  return null;
}
