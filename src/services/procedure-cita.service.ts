import { prisma } from "../config/prisma";
import { CreateProcedureCitaDTO } from "../models/schemas/procedure-cita.schema";

const procedureCitaInclude = {
  procedimiento: {
    select: {
      id: true,
      nombre: true,
      descripcion: true,
      costo: true,
      duracionMinutos: true,
    },
  },
  ejecutor: {
    select: {
      id: true,
      usuario: { select: { nombreCompleto: true } },
    },
  },
} as const;

class ProcedureCitaService {
  async getByAppointment(citaId: string) {
    return prisma.procedureCita.findMany({
      where: { citaId },
      include: procedureCitaInclude,
      orderBy: { creadoEn: "asc" },
    });
  }

  async getById(id: string) {
    return prisma.procedureCita.findUnique({
      where: { id },
      include: procedureCitaInclude,
    });
  }

  async create(data: CreateProcedureCitaDTO) {
    return prisma.procedureCita.create({
      data: {
        procedimientoId: data.procedimientoId,
        citaId: data.citaId,
        realizadoPor: data.realizadoPor,
      },
      include: procedureCitaInclude,
    });
  }

  async delete(id: string) {
    return prisma.procedureCita.delete({ where: { id } });
  }
}

export const procedureCitaService = new ProcedureCitaService();
