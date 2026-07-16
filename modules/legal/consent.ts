export const CONSENT_STORAGE_KEY = "alterna-cookie-consent";
export const CONSENT_VERSION = 1;

export interface CookieConsent {
  version: number;
  necessary: true;
  analytics: boolean;
  decidedAt: string;
}

export function parseConsent(raw: string | null): CookieConsent | null {
  if (!raw) return null;
  try {
    const data = JSON.parse(raw) as Partial<CookieConsent>;
    if (data.version !== CONSENT_VERSION) return null;
    if (data.necessary !== true) return null;
    if (typeof data.analytics !== "boolean") return null;
    if (typeof data.decidedAt !== "string") return null;
    return {
      version: CONSENT_VERSION,
      necessary: true,
      analytics: data.analytics,
      decidedAt: data.decidedAt,
    };
  } catch {
    return null;
  }
}

export function createConsent(analytics: boolean): CookieConsent {
  return {
    version: CONSENT_VERSION,
    necessary: true,
    analytics,
    decidedAt: new Date().toISOString(),
  };
}

export function readConsent(): CookieConsent | null {
  if (typeof window === "undefined") return null;
  return parseConsent(localStorage.getItem(CONSENT_STORAGE_KEY));
}

export function writeConsent(consent: CookieConsent) {
  localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consent));
  window.dispatchEvent(new CustomEvent("alterna:consent", { detail: consent }));
}

export function hasAnalyticsConsent(consent: CookieConsent | null): boolean {
  return Boolean(consent?.analytics);
}
