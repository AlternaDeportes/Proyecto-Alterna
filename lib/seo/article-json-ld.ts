import { siteConfig } from "@/config/site";
import { absoluteUrl } from "@/lib/seo/metadata";

export function articleJsonLd(input: {
  title: string;
  description: string;
  slug: string;
  publishedAt: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.description,
    url: absoluteUrl(`/historias/${input.slug}`),
    datePublished: input.publishedAt ?? undefined,
    inLanguage: siteConfig.locale,
    author: {
      "@type": "Organization",
      name: siteConfig.name,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: absoluteUrl("/"),
    },
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: absoluteUrl("/"),
    },
  };
}
