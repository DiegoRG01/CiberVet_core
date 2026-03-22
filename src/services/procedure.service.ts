import { prisma } from "../config/prisma";
import { CreateProcedureDTO, UpdateProcedureDTO } from "../models/schemas/procedure.schema";

const procedureInclude = {
  cita: {
    select: {
      id: true,
      fechaHora: true,
      motivo: true,
      paciente: { select: { id: true, nombre: true } },
    },
  },
  ejecutor: {
    select: {
      id: true,
      usuario: { select: { nombreCompleto: true } },
    },
  },
} as const;

class ProcedureService {
  async getAllProcedures(includeInactive = false) {
    return prisma.procedure.findMany({
      where: includeInactive ? undefined : { estaActivo: true },
      include: procedureInclude,
      orderBy: { creadoEn: "desc" },
    });
  }

  async getProcedureById(id: string) {
    return prisma.procedure.findUnique({
      where: { id },
      include: procedureInclude,
    });
  }

  async createProcedure(data: CreateProcedureDTO) {
    return prisma.procedure.create({
      data: {
        citaId: data.citaId,
        nombre: data.nombre,
        descripcion: data.descripcion,
        costo: data.costo,
        duracionMinutos: data.duracionMinutos,
        realizadoPor: data.realizadoPor,
        estaActivo: data.estaActivo ?? true,
      },
      include: procedureInclude,
    });
  }

  async updateProcedure(id: string, data: UpdateProcedureDTO) {
    return prisma.procedure.update({
      where: { id },
      data: {
        ...(data.citaId !== undefined && { citaId: data.citaId }),
        ...(data.nombre !== undefined && { nombre: data.nombre }),
        ...(data.descripcion !== undefined && { descripcion: data.descripcion }),
        ...(data.costo !== undefined && { costo: data.costo }),
        ...(data.duracionMinutos !== undefined && { duracionMinutos: data.duracionMinutos }),
        ...(data.realizadoPor !== undefined && { realizadoPor: data.realizadoPor }),
        ...(data.estaActivo !== undefined && { estaActivo: data.estaActivo }),
      },
      include: procedureInclude,
    });
  }

  async toggleActive(id: string, active: boolean) {
    return prisma.procedure.update({
      where: { id },
      data: { estaActivo: active },
      include: procedureInclude,
    });
  }
}

export const procedureService = new ProcedureService();
