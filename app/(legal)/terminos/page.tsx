import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { LegalDocument } from "@/modules/legal/components/LegalDocument";

export const metadata: Metadata = buildPageMetadata({
  title: "Términos",
  description: `Términos de uso de ${siteConfig.name}: participación, contenido y responsabilidades.`,
  path: "/terminos",
});

export default function TerminosPage() {
  return (
    <LegalDocument
      badge="Legal"
      title="Términos de uso"
      summary={`Condiciones para navegar, aportar y participar en ${siteConfig.name}.`}
      updatedAt="16 de julio de 2026"
      sections={[
        {
          title: "Aceptación",
          paragraphs: [
            `Al usar ${siteConfig.name} aceptás estos términos. Si no estás de acuerdo, no uses las funciones de participación (login, comentarios, aportes al mapa).`,
          ],
        },
        {
          title: "El proyecto",
          paragraphs: [
            `${siteConfig.name} es una plataforma transmedia documental sobre deportes alternativos. El contenido editorial, el mapa y la comunidad buscan visibilizar prácticas reales en ${siteConfig.defaultCity.name}.`,
            "Parte del contenido puede estar en producción o marcado como placeholder hasta su publicación definitiva.",
          ],
        },
        {
          title: "Cuentas y participación",
          paragraphs: [
            "Para comentar o proponer puntos necesitás iniciar sesión con Google. Sos responsable de la veracidad de lo que publicás.",
            "Nos reservamos el derecho de moderar, ocultar o rechazar aportes que sean ofensivos, ilegales, spam o que pongan en riesgo a personas.",
          ],
        },
        {
          title: "Contenido de usuarios",
          paragraphs: [
            "Al enviar un aporte (comentario, punto de mapa, mensaje) nos otorgás una licencia no exclusiva para mostrarlo en el sitio y canales del proyecto, con atribución cuando corresponda.",
            "No publiques datos sensibles de terceros sin consentimiento.",
          ],
        },
        {
          title: "Propiedad intelectual",
          paragraphs: [
            `Marca, diseño y contenidos editoriales de ${siteConfig.name} pertenecen al proyecto y a sus autores. Podés compartir enlaces con fines no comerciales citando la fuente.`,
          ],
        },
        {
          title: "Limitación",
          paragraphs: [
            "La información del mapa (horarios, contactos, ubicaciones) puede cambiar. Verificá siempre con las comunidades locales antes de asistir.",
            "El sitio se ofrece “tal cual”; trabajamos para mantenerlo disponible, pero pueden existir interrupciones técnicas.",
          ],
        },
        {
          title: "Contacto",
          paragraphs: [
            `Consultas: ${siteConfig.contact.email}.`,
          ],
        },
      ]}
    />
  );
}
