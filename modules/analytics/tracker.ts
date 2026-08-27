const SESSION_KEY = "alterna-analytics-sid";

function randomId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `sid_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function getAnalyticsSessionId() {
  if (typeof window === "undefined") return "";
  const existing = localStorage.getItem(SESSION_KEY);
  if (existing && existing.length >= 8) return existing;
  const next = randomId();
  localStorage.setItem(SESSION_KEY, next);
  return next;
}

export function isPublicAnalyticsPath(path: string) {
  if (!path.startsWith("/")) return false;
  const blocked = ["/api", "/panel-admin", "/perfil", "/ingresar", "/offline"];
  return !blocked.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
}

export async function sendPageView(path: string, referrer?: string) {
  if (!isPublicAnalyticsPath(path)) return;

  const payload = JSON.stringify({
    path,
    referrer: referrer || undefined,
    sessionId: getAnalyticsSessionId(),
  });

  try {
    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      const blob = new Blob([payload], { type: "application/json" });
      navigator.sendBeacon("/api/analytics/visita", blob);
      return;
    }
  } catch {
    /* fallback fetch */
  }

  await fetch("/api/analytics/visita", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
    keepalive: true,
  }).catch(() => undefined);
}
