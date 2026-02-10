import { prisma } from "../config/prisma";
import { AppointmentStatus } from "../generated/prisma/enums";

export class AppointmentService {
  /**
   * Obtener todas las citas con filtros opcionales
   */
  async getAllAppointments(estado?: AppointmentStatus) {
    try {
      const appointments = await prisma.appointment.findMany({
        where: estado ? { estado } : undefined,
        include: {
          paciente: {
            select: {
              id: true,
              nombre: true,
              especie: {
                select: {
                  nombre: true,
                },
              },
              raza: {
                select: {
                  nombre: true,
                },
              },
            },
          },
          propietario: {
            select: {
              id: true,
              usuario: {
                select: {
                  nombreCompleto: true,
                  correo: true,
                  telefono: true,
                },
              },
            },
          },
          veterinaria: {
            select: {
              id: true,
              nombre: true,
            },
          },
          operador: {
            select: {
              id: true,
              usuario: {
                select: {
                  nombreCompleto: true,
                },
              },
            },
          },
        },
        orderBy: {
          fechaHora: "asc",
        },
      });

      return appointments;
    } catch (error) {
      console.error("Error en AppointmentService.getAllAppointments:", error);
      throw error;
    }
  }

  /**
   * Obtener una cita por ID
   */
  async getAppointmentById(appointmentId: string) {
    try {
      const appointment = await prisma.appointment.findUnique({
        where: { id: appointmentId },
        include: {
          paciente: {
            select: {
              id: true,
              nombre: true,
              especie: {
                select: {
                  nombre: true,
                },
              },
              raza: {
                select: {
                  nombre: true,
                },
              },
            },
          },
          propietario: {
            select: {
              id: true,
              usuario: {
                select: {
                  nombreCompleto: true,
                  correo: true,
                  telefono: true,
                },
              },
            },
          },
          veterinaria: {
            select: {
              id: true,
              nombre: true,
            },
          },
          operador: {
            select: {
              id: true,
              usuario: {
                select: {
                  nombreCompleto: true,
                },
              },
            },
          },
          procedimientos: true,
          registrosClinico: true,
        },
      });

      return appointment;
    } catch (error) {
      console.error("Error en AppointmentService.getAppointmentById:", error);
      throw error;
    }
  }

  /**
   * Crear una nueva cita
   */
  async createAppointment(data: {
    pacienteId: string;
    veterinariaId?: string;
    operadorId?: string;
    fechaHora: Date;
    duracionMinutos?: number;
    tipoCita?: string;
    motivo: string;
    notas?: string;
    creadoPor?: string;
  }) {
    try {
      // Verificar que el paciente existe
      const patient = await prisma.patient.findUnique({
        where: { id: data.pacienteId },
        include: {
          propietario: true,
        },
      });

      if (!patient) {
        throw new Error("El paciente especificado no existe");
      }

      const appointment = await prisma.appointment.create({
        data: {
          pacienteId: data.pacienteId,
          propietarioId: patient.propietarioId,
          veterinariaId: data.veterinariaId,
          operadorId: data.operadorId,
          fechaHora: data.fechaHora,
          duracionMinutos: data.duracionMinutos || 30,
          tipoCita: data.tipoCita,
          motivo: data.motivo,
          notas: data.notas,
          creadoPor: data.creadoPor,
        },
        include: {
          paciente: {
            select: {
              id: true,
              nombre: true,
            },
          },
          propietario: {
            select: {
              id: true,
              usuario: {
                select: {
                  nombreCompleto: true,
                },
              },
            },
          },
        },
      });

      return appointment;
    } catch (error) {
      console.error("Error en AppointmentService.createAppointment:", error);
      throw error;
    }
  }

  /**
   * Actualizar una cita
   */
  async updateAppointment(
    appointmentId: string,
    data: {
      fechaHora?: Date;
      duracionMinutos?: number;
      estado?: AppointmentStatus;
      tipoCita?: string;
      motivo?: string;
      notas?: string;
    }
  ) {
    try {
      const appointment = await prisma.appointment.update({
        where: { id: appointmentId },
        data,
        include: {
          paciente: {
            select: {
              id: true,
              nombre: true,
            },
          },
          propietario: {
            select: {
              id: true,
              usuario: {
                select: {
                  nombreCompleto: true,
                },
              },
            },
          },
        },
      });

      return appointment;
    } catch (error) {
      console.error("Error en AppointmentService.updateAppointment:", error);
      throw error;
    }
  }

  /**
   * Cancelar una cita
   */
  async cancelAppointment(appointmentId: string, reason?: string) {
    try {
      const appointment = await prisma.appointment.update({
        where: { id: appointmentId },
        data: {
          estado: "cancelada",
          canceladoEn: new Date(),
          motivoCancelacion: reason,
        },
      });

      return appointment;
    } catch (error) {
      console.error("Error en AppointmentService.cancelAppointment:", error);
      throw error;
    }
  }
}

export const appointmentService = new AppointmentService();
