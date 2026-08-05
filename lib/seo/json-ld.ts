import { siteConfig, socialLinks } from "@/config/site";
import { absoluteUrl, getSiteUrl } from "@/lib/seo/metadata";

type JsonLd = Record<string, unknown>;

export function organizationJsonLd(): JsonLd {
  const sameAs = socialLinks.map(({ key }) => siteConfig.social[key]);

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    description: siteConfig.description,
    url: getSiteUrl(),
    email: siteConfig.contact.email,
    ...(siteConfig.contact.phone
      ? { telephone: siteConfig.contact.phone }
      : {}),
    logo: absoluteUrl("/brand/logo-blanco-transparent.png"),
    sameAs,
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.defaultCity.name,
      addressRegion: siteConfig.defaultCity.region,
      addressCountry: "AR",
    },
  };
}

export function websiteJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    alternateName: siteConfig.tagline,
    url: getSiteUrl(),
    description: siteConfig.description,
    inLanguage: siteConfig.locale,
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: getSiteUrl(),
    },
  };
}

export function breadcrumbJsonLd(
  items: { name: string; path: string }[]
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function sportJsonLd(input: {
  name: string;
  description: string;
  slug: string;
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "SportsActivityLocation",
    name: input.name,
    description: input.description,
    url: absoluteUrl(`/deportes/${input.slug}`),
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.defaultCity.name,
      addressRegion: siteConfig.defaultCity.region,
      addressCountry: "AR",
    },
  };
}

export function serializeJsonLd(data: JsonLd | JsonLd[]): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
