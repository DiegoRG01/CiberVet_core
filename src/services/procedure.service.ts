import { prisma } from "../config/prisma";
import { CreateProcedureDTO, UpdateProcedureDTO } from "../models/schemas/procedure.schema";

class ProcedureService {
  async getAllProcedures(includeInactive = false) {
    return prisma.procedure.findMany({
      where: includeInactive ? undefined : { estaActivo: true },
      orderBy: { creadoEn: "desc" },
    });
  }

  async getProcedureById(id: string) {
    return prisma.procedure.findUnique({ where: { id } });
  }

  async createProcedure(data: CreateProcedureDTO) {
    return prisma.procedure.create({
      data: {
        nombre: data.nombre,
        descripcion: data.descripcion,
        costo: data.costo,
        duracionMinutos: data.duracionMinutos,
        estaActivo: data.estaActivo ?? true,
      },
    });
  }

  async updateProcedure(id: string, data: UpdateProcedureDTO) {
    return prisma.procedure.update({
      where: { id },
      data: {
        ...(data.nombre !== undefined && { nombre: data.nombre }),
        ...(data.descripcion !== undefined && { descripcion: data.descripcion }),
        ...(data.costo !== undefined && { costo: data.costo }),
        ...(data.duracionMinutos !== undefined && { duracionMinutos: data.duracionMinutos }),
        ...(data.estaActivo !== undefined && { estaActivo: data.estaActivo }),
      },
    });
  }

  async toggleActive(id: string, active: boolean) {
    return prisma.procedure.update({
      where: { id },
      data: { estaActivo: active },
    });
  }
}

export const procedureService = new ProcedureService();
