import { prisma } from "../config/prisma";

export const ACCIONES = {
  CREACION: "CREACION",
  ACTUALIZACION: "ACTUALIZACION",
  DESACTIVACION: "DESACTIVACION",
  CANCELACION: "CANCELACION",
  ELIMINACION: "ELIMINACION",
} as const;

export const ENTIDADES = {
  PACIENTE: "PACIENTE",
  CITA: "CITA",
  PROPIETARIO: "PROPIETARIO",
  PROCEDIMIENTO: "PROCEDIMIENTO",
} as const;

export type TipoAccion = (typeof ACCIONES)[keyof typeof ACCIONES];
export type TipoEntidad = (typeof ENTIDADES)[keyof typeof ENTIDADES];

interface LogActivityParams {
  tipoAccion: TipoAccion;
  tipoEntidad?: TipoEntidad;
  entidadId?: string;
  descripcion: string;
  veterinariaId?: string | null;
}

/**
 * Registra una actividad en el log del sistema.
 * Fire-and-forget: nunca lanza excepciones para no interrumpir la operación principal.
 */
export const logActivity = (params: LogActivityParams): void => {
  prisma.activityLog
    .create({
      data: {
        tipoAccion: params.tipoAccion,
        tipoEntidad: params.tipoEntidad ?? null,
        entidadId: params.entidadId ?? null,
        descripcion: params.descripcion,
        veterinariaId: params.veterinariaId ?? null,
      },
    })
    .catch((error) => {
      console.error("Error al registrar actividad en el log:", error);
    });
};
