import { prisma } from "../config/prisma";
import { CreateOwnerDTO, UpdateOwnerDTO } from "../models/schemas/owner.schema";

const OWNER_INCLUDE = {
  usuario: {
    select: {
      id: true,
      nombreCompleto: true,
      correo: true,
      telefono: true,
      rol: true,
      estaActivo: true,
    },
  },
  _count: {
    select: { pacientes: true },
  },
} as const;

const OWNER_DETAIL_INCLUDE = {
  ...OWNER_INCLUDE,
  pacientes: {
    include: {
      especie: { select: { id: true, nombre: true } },
      raza: { select: { id: true, nombre: true } },
    },
    orderBy: { nombre: "asc" as const },
  },
} as const;

export class OwnerService {
  async getAllOwners(includeInactive: boolean = false) {
    try {
      return await prisma.owner.findMany({
        where: includeInactive ? undefined : { usuario: { estaActivo: true } },
        include: OWNER_INCLUDE,
        orderBy: { usuario: { nombreCompleto: "asc" } },
      });
    } catch (error) {
      console.error("Error en OwnerService.getAllOwners:", error);
      throw error;
    }
  }

  async getOwnerById(ownerId: string) {
    try {
      return await prisma.owner.findUnique({
        where: { id: ownerId },
        include: OWNER_DETAIL_INCLUDE,
      });
    } catch (error) {
      console.error("Error en OwnerService.getOwnerById:", error);
      throw error;
    }
  }

  async getOwnerByUserId(userId: string) {
    try {
      return await prisma.owner.findUnique({
        where: { usuarioId: userId },
        include: OWNER_DETAIL_INCLUDE,
      });
    } catch (error) {
      console.error("Error en OwnerService.getOwnerByUserId:", error);
      throw error;
    }
  }

  async createOwner(data: CreateOwnerDTO) {
    try {
      const user = await prisma.user.findUnique({ where: { id: data.usuarioId } });
      if (!user) throw new Error("El usuario especificado no existe");

      const existing = await prisma.owner.findUnique({ where: { usuarioId: data.usuarioId } });
      if (existing) throw new Error("Ya existe un propietario vinculado a ese usuario");

      return await prisma.owner.create({
        data: {
          usuarioId: data.usuarioId,
          veterinariaId: data.veterinariaId,
          direccion: data.direccion,
          ciudad: data.ciudad,
          nombreContactoEmergencia: data.nombreContactoEmergencia,
          telefonoContactoEmergencia: data.telefonoContactoEmergencia,
          notas: data.notas,
        },
        include: OWNER_DETAIL_INCLUDE,
      });
    } catch (error) {
      console.error("Error en OwnerService.createOwner:", error);
      throw error;
    }
  }

  async updateOwner(ownerId: string, data: UpdateOwnerDTO) {
    try {
      if (data.usuarioId) {
        const user = await prisma.user.findUnique({ where: { id: data.usuarioId } });
        if (!user) throw new Error("El usuario especificado no existe");

        const existingOtherOwner = await prisma.owner.findFirst({
          where: { usuarioId: data.usuarioId, id: { not: ownerId } },
        });
        if (existingOtherOwner) throw new Error("Ese usuario ya está vinculado a otro propietario");
      }

      return await prisma.owner.update({
        where: { id: ownerId },
        data: {
          ...(data.usuarioId !== undefined && { usuarioId: data.usuarioId }),
          ...(data.veterinariaId !== undefined && { veterinariaId: data.veterinariaId }),
          ...(data.direccion !== undefined && { direccion: data.direccion }),
          ...(data.ciudad !== undefined && { ciudad: data.ciudad }),
          ...(data.nombreContactoEmergencia !== undefined && { nombreContactoEmergencia: data.nombreContactoEmergencia }),
          ...(data.telefonoContactoEmergencia !== undefined && { telefonoContactoEmergencia: data.telefonoContactoEmergencia }),
          ...(data.notas !== undefined && { notas: data.notas }),
        },
        include: OWNER_DETAIL_INCLUDE,
      });
    } catch (error) {
      console.error("Error en OwnerService.updateOwner:", error);
      throw error;
    }
  }

  async deactivateOwner(ownerId: string) {
    try {
      const owner = await prisma.owner.findUnique({
        where: { id: ownerId },
        select: { usuarioId: true },
      });

      if (!owner) throw new Error("Propietario no encontrado");

      await prisma.user.update({
        where: { id: owner.usuarioId },
        data: { estaActivo: false },
      });
    } catch (error) {
      console.error("Error en OwnerService.deactivateOwner:", error);
      throw error;
    }
  }
}

export const ownerService = new OwnerService();
