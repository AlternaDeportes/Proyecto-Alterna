import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { LegalDocument } from "@/modules/legal/components/LegalDocument";

export const metadata: Metadata = buildPageMetadata({
  title: "Cookies",
  description: `Política de cookies de ${siteConfig.name}: tipos, finalidad y cómo gestionar tu consentimiento.`,
  path: "/cookies",
});

export default function CookiesPage() {
  return (
    <LegalDocument
      badge="Legal"
      title="Cookies"
      summary="Qué cookies usamos, cuáles son opcionales y cómo cambiar tu preferencia."
      updatedAt="25 de agosto de 2026"
      sections={[
        {
          title: "Qué son",
          paragraphs: [
            "Las cookies son pequeños archivos que el navegador guarda para recordar preferencias, mantener la sesión o medir uso del sitio.",
          ],
        },
        {
          title: "Cookies necesarias",
          paragraphs: [
            "Siempre activas: permiten seguridad básica, sesión de autenticación y recordar tu decisión de consentimiento.",
          ],
          bullets: [
            "Sesión Auth.js / NextAuth (cuando iniciás sesión).",
            "Preferencia de consentimiento de cookies (almacenada en localStorage).",
          ],
        },
        {
          title: "Cookies analíticas (opcionales)",
          paragraphs: [
            "Solo se activan si elegís “Aceptar todas”. Sirven para entender visitas agregadas (páginas más vistas, dispositivos) y mejorar el sitio.",
            "Hoy medimos esas visitas de forma propia (sin identificarte): ruta, tipo de dispositivo y una sesión anónima. El equipo las ve en /panel-admin → Métricas. Si más adelante sumamos Plausible o Google Analytics, el script de terceros también se carga solo con este consentimiento.",
          ],
        },
        {
          title: "Cómo gestionarlas",
          paragraphs: [
            "Podés aceptar solo las necesarias o todas desde el banner. En escritorio, el botón flotante “Cookies” vuelve a abrir esa elección.",
            "También podés borrar cookies y datos del sitio desde la configuración de tu navegador.",
          ],
        },
        {
          title: "Más información",
          paragraphs: [
            `Si tenés dudas: ${siteConfig.contact.email}. Revisá también la Política de privacidad.`,
          ],
        },
      ]}
    />
  );
}
