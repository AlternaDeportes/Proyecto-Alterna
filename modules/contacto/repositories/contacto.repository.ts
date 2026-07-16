import { prisma } from "@/lib/prisma";
import type { ContactoMensajeInput } from "@/modules/contacto/types";

export const contactoRepository = {
  async crear(datos: ContactoMensajeInput, usuarioId?: string) {
    return prisma.contactoMensaje.create({
      data: {
        nombre: datos.nombre,
        email: datos.email,
        interes: datos.interes,
        mensaje: datos.mensaje,
        usuarioId,
      },
      select: { id: true },
    });
  },
};
