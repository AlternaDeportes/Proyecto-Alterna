import { z } from "zod";
import { FAVORITO_ENTIDADES } from "@/modules/usuarios/types";

export const favoritoSchema = z.object({
  entidad: z.enum(FAVORITO_ENTIDADES),
  entidadId: z.string().min(1),
});

export type FavoritoInput = z.infer<typeof favoritoSchema>;
