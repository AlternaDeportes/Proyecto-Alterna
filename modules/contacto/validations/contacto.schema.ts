import { z } from "zod";

export const INTERESES_CONTACTO = [
  "Ultimate Frisbee",
  "Newcom",
  "Wingfoil",
  "Colaborar con ALTERNA",
  "Otro",
] as const;

export const contactoFormSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(2, "Ingresá al menos 2 caracteres.")
    .max(80, "El nombre es demasiado largo."),
  email: z.string().trim().email("Ingresá un email válido."),
  interes: z.enum(INTERESES_CONTACTO, {
    errorMap: () => ({ message: "Elegí una opción." }),
  }),
  mensaje: z
    .string()
    .trim()
    .min(10, "El mensaje debe tener al menos 10 caracteres.")
    .max(2000, "El mensaje es demasiado largo."),
  /** Honeypot anti-spam: debe quedar vacío */
  website: z.string().optional().default(""),
});

export type ContactoFormInput = z.infer<typeof contactoFormSchema>;
