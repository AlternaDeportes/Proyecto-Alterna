import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { LegalDocument } from "@/modules/legal/components/LegalDocument";

export const metadata: Metadata = buildPageMetadata({
  title: "Privacidad",
  description: `Política de privacidad de ${siteConfig.name}: datos personales, contacto y derechos.`,
  path: "/privacidad",
});

export default function PrivacidadPage() {
  return (
    <LegalDocument
      badge="Legal"
      title="Privacidad"
      summary={`Cómo ${siteConfig.name} trata los datos personales cuando usás el sitio, el formulario de contacto o iniciás sesión.`}
      updatedAt="25 de agosto de 2026"
      sections={[
        {
          title: "Responsable",
          paragraphs: [
            `${siteConfig.name} (${siteConfig.tagline}) es un proyecto académico-documental con foco en ${siteConfig.defaultCity.name}, ${siteConfig.defaultCity.country}.`,
            `Contacto: ${siteConfig.contact.email}.`,
          ],
        },
        {
          title: "Qué datos recolectamos",
          paragraphs: [
            "Solo pedimos datos necesarios para operar el sitio y responder consultas.",
          ],
          bullets: [
            "Formularios de contacto / comunidad: nombre, email, mensaje e interés declarado.",
            "Inicio de sesión con Google: nombre, email y foto de perfil que provee el proveedor OAuth.",
            "Aportes al mapa: datos del punto propuesto y vínculo con tu cuenta.",
            "Analítica opcional (solo si aceptás cookies analíticas): ruta visitada, tipo de dispositivo y un identificador de sesión anónimo. No asociamos esa visita a tu cuenta ni guardamos IP con ese fin.",
            "Datos técnicos básicos del servidor (IP, fecha, user-agent) en logs de seguridad y rate limit.",
          ],
        },
        {
          title: "Para qué los usamos",
          paragraphs: [
            "Responder consultas, moderar aportes comunitarios, mantener la sesión de usuario y mejorar el servicio.",
            "No vendemos datos personales. No usamos marketing invasivo.",
          ],
        },
        {
          title: "Base y conservación",
          paragraphs: [
            "Tratamos los datos con base en tu consentimiento (formularios y cookies opcionales) y en la ejecución de funcionalidades que solicitás (login, comentarios, aportes).",
            "Conservamos los mensajes y aportes el tiempo necesario para la gestión del proyecto. Podés pedir acceso, rectificación o eliminación escribiendo a nuestro email.",
          ],
        },
        {
          title: "Proveedores",
          paragraphs: [
            "Podemos usar infraestructura de hosting, base de datos PostgreSQL, email transaccional y autenticación OAuth. Cada proveedor solo recibe lo indispensable para su función.",
          ],
        },
        {
          title: "Cookies",
          paragraphs: [
            "Las cookies necesarias permiten sesión y preferencias básicas. Las analíticas son opcionales y requieren tu consentimiento. Detalle en la Política de cookies.",
          ],
        },
        {
          title: "Tus derechos",
          paragraphs: [
            "Podés solicitar acceso, actualización o borrado de tus datos personales contactándonos. Si el pedido afecta contenido moderado del mapa, evaluaremos la solicitud conforme a las reglas de la comunidad.",
          ],
        },
      ]}
    />
  );
}
