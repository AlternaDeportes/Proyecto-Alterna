import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

function stripSlash(url: string) {
  return url.replace(/\/$/, "");
}

function isLocalhostUrl(url: string) {
  return /localhost|127\.0\.0\.1/i.test(url);
}

/** URL canónica del sitio (env pública, host de Vercel o config). */
export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL
    ? stripSlash(process.env.NEXT_PUBLIC_SITE_URL)
    : undefined;
  const authUrl = process.env.AUTH_URL ? stripSlash(process.env.AUTH_URL) : undefined;
  const vercelProd = process.env.VERCEL_PROJECT_PRODUCTION_URL;

  if (fromEnv && !isLocalhostUrl(fromEnv)) return fromEnv;
  if (authUrl && !isLocalhostUrl(authUrl)) return authUrl;
  if (vercelProd) return `https://${stripSlash(vercelProd)}`;
  if (fromEnv) return fromEnv;
  return stripSlash(siteConfig.url);
}

export function absoluteUrl(path = "/"): string {
  const base = getSiteUrl();
  if (!path || path === "/") return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export interface PageSeoInput {
  title: string;
  description: string;
  path?: string;
  /** Si false, no indexar (login, etc.) */
  index?: boolean;
  type?: "website" | "article";
  image?: string;
  /** Si true, el título de la pestaña es exactamente `title` (sin sufijo). */
  absolute?: boolean;
}

/** Construye Metadata consistente para páginas del sitio. */
export function buildPageMetadata({
  title,
  description,
  path = "/",
  index = true,
  type = "website",
  image,
  absolute = false,
}: PageSeoInput): Metadata {
  const url = absoluteUrl(path);
  const ogImage = image ? absoluteUrl(image) : absoluteUrl("/opengraph-image");
  const fullTitle = absolute ? title : `${title} | ${siteConfig.tabName}`;

  return {
    title: absolute ? { absolute: title } : title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: siteConfig.tabName,
      locale: siteConfig.locale,
      type,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${siteConfig.name} — ${siteConfig.tagline}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
    },
    robots: index
      ? { index: true, follow: true }
      : { index: false, follow: false },
  };
}

/** Metadata raíz del layout (default + template). */
export function buildRootMetadata(): Metadata {
  const base = getSiteUrl();

  return {
    metadataBase: new URL(base),
    title: {
      default: siteConfig.tabName,
      template: `%s | ${siteConfig.tabName}`,
    },
    description: siteConfig.description,
    applicationName: siteConfig.tabName,
    authors: [{ name: siteConfig.name }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    keywords: [
      "deportes alternativos",
      "Santa Fe",
      "Ultimate Frisbee",
      "Newcom",
      "Wingfoil",
      "documental",
      "transmedia",
      "Alterna",
      "ALTERNA",
    ],
    alternates: {
      canonical: base,
    },
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      url: base,
      siteName: siteConfig.tabName,
      title: siteConfig.tabName,
      description: siteConfig.description,
      images: [
        {
          url: absoluteUrl("/opengraph-image"),
          width: 1200,
          height: 630,
          alt: `${siteConfig.name} — ${siteConfig.tagline}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: siteConfig.tabName,
      description: siteConfig.description,
      images: [absoluteUrl("/opengraph-image")],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    category: "sports",
    manifest: "/manifest.webmanifest",
    appleWebApp: {
      capable: true,
      statusBarStyle: "black-translucent",
      title: siteConfig.tabName,
    },
    icons: {
      icon: [
        { url: "/icons/favicon-32.png", sizes: "32x32", type: "image/png" },
        { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
        { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      ],
      apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    },
  };
}
