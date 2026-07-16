import { serializeJsonLd } from "@/lib/seo/json-ld";

interface JsonLdScriptProps {
  data: Record<string, unknown> | Record<string, unknown>[];
  id?: string;
}

/** Inyecta JSON-LD Schema.org de forma segura. */
export function JsonLdScript({ data, id }: JsonLdScriptProps) {
  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
