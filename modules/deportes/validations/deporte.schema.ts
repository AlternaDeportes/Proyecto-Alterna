import { z } from "zod";

export const deporteSlugSchema = z
  .string()
  .min(2)
  .max(80)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug inválido");

export type DeporteSlugInput = z.infer<typeof deporteSlugSchema>;
