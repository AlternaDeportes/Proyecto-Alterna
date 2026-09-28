import { hasAnalyticsConsent, readConsent } from "@/modules/legal/consent";

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

function utmFromLocation() {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const pick = (key: string) => {
    const value = params.get(key)?.trim();
    if (!value || !/^[A-Za-z0-9._~+-]{1,40}$/.test(value)) return undefined;
    return value;
  };
  return {
    utmSource: pick("utm_source"),
    utmMedium: pick("utm_medium"),
    utmCampaign: pick("utm_campaign"),
  };
}

function postAnalytics(url: string, payload: string) {
  try {
    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      const blob = new Blob([payload], { type: "application/json" });
      if (navigator.sendBeacon(url, blob)) return;
    }
  } catch {
    /* fallback fetch */
  }

  void fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
    keepalive: true,
  }).catch(() => undefined);
}

export async function sendPageView(path: string, referrer?: string) {
  if (!isPublicAnalyticsPath(path)) return;
  if (!hasAnalyticsConsent(readConsent())) return;

  postAnalytics(
    "/api/analytics/visita",
    JSON.stringify({
      path,
      referrer: referrer || undefined,
      sessionId: getAnalyticsSessionId(),
      ...utmFromLocation(),
    })
  );
}

export function sendEngagement(path: string, durationMs: number, scrollPct: number) {
  if (!isPublicAnalyticsPath(path)) return;
  if (!hasAnalyticsConsent(readConsent())) return;
  postAnalytics(
    "/api/analytics/engagement",
    JSON.stringify({
      path,
      sessionId: getAnalyticsSessionId(),
      durationMs,
      scrollPct,
    })
  );
}

export function trackEvent(
  type: "play" | "progress" | "map_filter" | "map_pin",
  target: string,
  value?: number
) {
  if (typeof window === "undefined") return;
  if (!hasAnalyticsConsent(readConsent())) return;
  const path = window.location.pathname;
  if (!isPublicAnalyticsPath(path)) return;
  postAnalytics(
    "/api/analytics/evento",
    JSON.stringify({
      type,
      target: target.slice(0, 80),
      sessionId: getAnalyticsSessionId(),
      path,
      value,
    })
  );
}
