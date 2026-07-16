import type { ContactoFormInput } from "@/modules/contacto/validations/contacto.schema";

export type ContactoMensajeInput = Omit<ContactoFormInput, "website">;

export interface ContactoMensajeResult {
  id: string;
  emailEnviado: boolean;
  guardadoEnDb: boolean;
}
