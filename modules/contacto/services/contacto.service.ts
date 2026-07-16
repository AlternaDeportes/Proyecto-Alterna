import { isDatabaseConfigured } from "@/config/env";
import { siteConfig } from "@/config/site";
import { getEmailProvider } from "@/lib/email";
import { contactoRepository } from "@/modules/contacto/repositories/contacto.repository";
import type { ContactoMensajeInput, ContactoMensajeResult } from "@/modules/contacto/types";
import { contactoFormSchema } from "@/modules/contacto/validations/contacto.schema";

function buildNotificationText(datos: ContactoMensajeInput) {
  return [
    `Nuevo mensaje de contacto — ${siteConfig.name}`,
    "",
    `Nombre: ${datos.nombre}`,
    `Email: ${datos.email}`,
    `Interés: ${datos.interes}`,
    "",
    "Mensaje:",
    datos.mensaje,
  ].join("\n");
}

export const contactoService = {
  async enviarMensaje(
    input: unknown,
    options?: { usuarioId?: string }
  ): Promise<ContactoMensajeResult> {
    const parsed = contactoFormSchema.safeParse(input);

    if (!parsed.success) {
      throw new ContactoValidationError(parsed.error.flatten().fieldErrors);
    }

    if (parsed.data.website) {
      return { id: "spam", emailEnviado: false, guardadoEnDb: false };
    }

    const { website: _honeypot, ...datos } = parsed.data;
    let id = `local-${Date.now()}`;
    let guardadoEnDb = false;

    if (isDatabaseConfigured()) {
      try {
        const registro = await contactoRepository.crear(datos, options?.usuarioId);
        id = registro.id;
        guardadoEnDb = true;
      } catch (error) {
        console.error("[contacto] Error al guardar en DB:", error);
      }
    }

    let emailEnviado = false;

    try {
      const provider = getEmailProvider();
      await provider.send({
        to: siteConfig.contact.email,
        replyTo: datos.email,
        subject: `[${siteConfig.name}] Contacto — ${datos.interes}`,
        text: buildNotificationText(datos),
      });
      emailEnviado = true;
    } catch (error) {
      console.error("[contacto] Error al enviar email:", error);
    }

    if (!guardadoEnDb && !emailEnviado) {
      throw new ContactoDeliveryError();
    }

    return { id, emailEnviado, guardadoEnDb };
  },
};

export class ContactoValidationError extends Error {
  constructor(public fieldErrors: Record<string, string[] | undefined>) {
    super("Datos de contacto inválidos");
    this.name = "ContactoValidationError";
  }
}

export class ContactoDeliveryError extends Error {
  constructor() {
    super("No se pudo registrar ni enviar el mensaje");
    this.name = "ContactoDeliveryError";
  }
}
