import { siteConfig } from "@/config/site";

function stripSlash(url: string) {
  return url.replace(/\/$/, "");
}

export function isLocalhostUrl(url: string) {
  return /localhost|127\.0\.0\.1/i.test(url);
}

function isUnusableAuthUrl(url: string) {
  return isLocalhostUrl(url) || /example\.com/i.test(url);
}

/**
 * En Vercel, AUTH_URL=localhost (o example.com) rompe OAuth.
 * Preferimos el host de producción.
 */
export function sanitizeAuthUrlForHost() {
  if (!process.env.VERCEL) return;

  if (process.env.AUTH_URL && isUnusableAuthUrl(process.env.AUTH_URL)) {
    delete process.env.AUTH_URL;
  }
  if (process.env.NEXTAUTH_URL && isUnusableAuthUrl(process.env.NEXTAUTH_URL)) {
    delete process.env.NEXTAUTH_URL;
  }

  if (!process.env.AUTH_URL) {
    const host =
      process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
    if (host) {
      process.env.AUTH_URL = `https://${stripSlash(host)}`;
    }
  }
}

/** Origen público para callbacks de OAuth y links de email. */
export function getAuthOrigin(): string {
  const authUrl = process.env.AUTH_URL ? stripSlash(process.env.AUTH_URL) : undefined;
  const publicUrl = process.env.NEXT_PUBLIC_SITE_URL
    ? stripSlash(process.env.NEXT_PUBLIC_SITE_URL)
    : undefined;
  const vercelProd = process.env.VERCEL_PROJECT_PRODUCTION_URL;

  if (process.env.VERCEL) {
    if (authUrl && !isUnusableAuthUrl(authUrl)) return authUrl;
    if (publicUrl && !isUnusableAuthUrl(publicUrl)) return publicUrl;
    if (vercelProd) return `https://${stripSlash(vercelProd)}`;
    if (process.env.VERCEL_URL) return `https://${stripSlash(process.env.VERCEL_URL)}`;
  }

  if (publicUrl) return publicUrl;
  if (authUrl) return authUrl;
  return stripSlash(siteConfig.url);
}

export function getGoogleCallbackUrl() {
  return `${getAuthOrigin()}/api/auth/callback/google`;
}

export function getGoogleJsOrigin() {
  return getAuthOrigin();
}
