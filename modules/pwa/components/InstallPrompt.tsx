"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const DISMISS_KEY = "alterna-pwa-install-dismissed";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

/**
 * Banner de instalación cuando el navegador dispara beforeinstallprompt.
 */
export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(display-mode: standalone)").matches) return;
    if (localStorage.getItem(DISMISS_KEY) === "1") return;

    const onPrompt = (event: Event) => {
      event.preventDefault();
      setDeferred(event as BeforeInstallPromptEvent);
      setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  if (!visible || !deferred) return null;

  async function install() {
    if (!deferred) return;
    await deferred.prompt();
    const choice = await deferred.userChoice;
    setDeferred(null);
    setVisible(false);
    if (choice.outcome === "dismissed") {
      localStorage.setItem(DISMISS_KEY, "1");
    }
  }

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
    setDeferred(null);
  }

  return (
    <div
      role="dialog"
      aria-label="Instalar ALTERNA"
      className="fixed bottom-4 left-4 right-4 z-[60] mx-auto max-w-md rounded-2xl border border-white/15 bg-brand-ink/95 p-4 shadow-2xl backdrop-blur-md sm:left-auto sm:right-6"
    >
      <p className="font-display text-sm font-bold uppercase tracking-wide text-white">
        Instalá ALTERNA
      </p>
      <p className="mt-1 text-sm text-white/70">
        Acceso rápido desde tu pantalla de inicio, con modo offline básico.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button type="button" size="sm" variant="secondary" onClick={() => void install()}>
          Instalar
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={dismiss}>
          Ahora no
        </Button>
      </div>
    </div>
  );
}
