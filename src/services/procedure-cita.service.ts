import { prisma } from "../config/prisma";
import { CreateProcedureCitaDTO } from "../models/schemas/procedure-cita.schema";
import { logActivity, ACCIONES, ENTIDADES } from "../utils/activityLogger";

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
    let operadorId = data.realizadoPor ?? null;

    if (operadorId) {
      // El frontend envía Veterinarian.id directamente, pero toleramos User.id para compatibilidad.
      const veterinarian = await prisma.veterinarian.findFirst({
        where: {
          OR: [
            { id: operadorId },
            { usuarioId: operadorId },
          ],
        },
        select: { id: true },
      });

      if (!veterinarian) {
        throw new Error("El veterinario especificado no existe");
      }

      operadorId = veterinarian.id;
    }

    // Obtener veterinariaId de la cita para el log antes de crear
    const cita = await prisma.appointment.findUnique({
      where: { id: data.citaId },
      select: { veterinariaId: true },
    });

    const result = await prisma.procedureCita.create({
      data: {
        procedimientoId: data.procedimientoId,
        citaId: data.citaId,
        realizadoPor: operadorId,
      },
      include: procedureCitaInclude,
    });

    logActivity({
      tipoAccion: ACCIONES.CREACION,
      tipoEntidad: ENTIDADES.PROCEDIMIENTO,
      entidadId: data.citaId,
      descripcion: `Procedimiento agregado: ${result.procedimiento?.nombre ?? "Desconocido"}`,
      veterinariaId: cita?.veterinariaId ?? null,
    });

    return result;
  }

  async delete(id: string) {
    // Obtener datos antes de borrar para el log
    const procedureCita = await prisma.procedureCita.findUnique({
      where: { id },
      include: {
        procedimiento: { select: { nombre: true } },
        cita: { select: { veterinariaId: true, id: true } },
      },
    });

    await prisma.procedureCita.delete({ where: { id } });

    if (procedureCita) {
      logActivity({
        tipoAccion: ACCIONES.ELIMINACION,
        tipoEntidad: ENTIDADES.PROCEDIMIENTO,
        entidadId: procedureCita.cita?.id ?? undefined,
        descripcion: `Procedimiento eliminado: ${procedureCita.procedimiento?.nombre ?? "Desconocido"}`,
        veterinariaId: procedureCita.cita?.veterinariaId ?? null,
      });
    }
  }
}

export const procedureCitaService = new ProcedureCitaService();
