"use client";

import { useEffect } from "react";

/**
 * Registra el service worker solo en producción (HTTPS / localhost).
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;
    if (process.env.NODE_ENV !== "production") return;

    const register = async () => {
      try {
        await navigator.serviceWorker.register("/sw.js", { scope: "/" });
      } catch (error) {
        console.warn("[pwa] No se pudo registrar el SW:", error);
      }
    };

    void register();
  }, []);

  return null;
}
