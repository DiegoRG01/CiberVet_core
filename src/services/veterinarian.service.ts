import { prisma } from "../config/prisma";

class VeterinarianService {
  async getAll() {
    return prisma.veterinarian.findMany({
      where: { estaActivo: true },
      select: {
        id: true,
        usuarioId: true,
        posicion: true,
        fechaContratacion: true,
        usuario: {
          select: {
            nombreCompleto: true,
            correo: true,
          },
        },
      },
      orderBy: {
        usuario: { nombreCompleto: "asc" },
      },
    });
  }

  async getById(id: string) {
    return prisma.veterinarian.findUnique({
      where: { id },
      select: {
        id: true,
        usuarioId: true,
        posicion: true,
        fechaContratacion: true,
        estaActivo: true,
        usuario: {
          select: {
            nombreCompleto: true,
            correo: true,
            telefono: true,
          },
        },
      },
    });
  }
}

export const veterinarianService = new VeterinarianService();
