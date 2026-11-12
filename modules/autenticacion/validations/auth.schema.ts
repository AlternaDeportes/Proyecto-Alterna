import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(8, "La contraseña debe tener al menos 8 caracteres.")
  .max(72, "La contraseña es demasiado larga.");

export const registroSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(2, "Ingresá al menos 2 caracteres.")
    .max(80, "El nombre es demasiado largo."),
  email: z.string().trim().email("Ingresá un email válido.").toLowerCase(),
  password: passwordSchema,
});

export const emailOnlySchema = z.object({
  email: z.string().trim().email("Ingresá un email válido.").toLowerCase(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(16, "El enlace no es válido."),
  password: passwordSchema,
});

export const verifyCodeSchema = z.object({
  email: z.string().trim().email("Ingresá un email válido.").toLowerCase(),
  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "El código tiene 6 dígitos."),
});

export type RegistroInput = z.infer<typeof registroSchema>;
