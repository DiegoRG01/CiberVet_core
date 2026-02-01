import { prisma } from "../config/prisma";
import { AppointmentStatus } from "../generated/prisma/enums";

export class AppointmentService {
  /**
   * Obtener todas las citas con filtros opcionales
   */
  async getAllAppointments(status?: AppointmentStatus) {
    try {
      const appointments = await prisma.appointment.findMany({
        where: status ? { status } : undefined,
        include: {
          patient: {
            select: {
              id: true,
              name: true,
              species: {
                select: {
                  name: true,
                },
              },
              breed: {
                select: {
                  name: true,
                },
              },
            },
          },
          owner: {
            select: {
              id: true,
              user: {
                select: {
                  fullName: true,
                  email: true,
                  phone: true,
                },
              },
            },
          },
          veterinary: {
            select: {
              id: true,
              name: true,
            },
          },
          operator: {
            select: {
              id: true,
              user: {
                select: {
                  fullName: true,
                },
              },
            },
          },
        },
        orderBy: {
          dateTime: "asc",
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
          patient: {
            select: {
              id: true,
              name: true,
              species: {
                select: {
                  name: true,
                },
              },
              breed: {
                select: {
                  name: true,
                },
              },
            },
          },
          owner: {
            select: {
              id: true,
              user: {
                select: {
                  fullName: true,
                  email: true,
                  phone: true,
                },
              },
            },
          },
          veterinary: {
            select: {
              id: true,
              name: true,
            },
          },
          operator: {
            select: {
              id: true,
              user: {
                select: {
                  fullName: true,
                },
              },
            },
          },
          procedures: true,
          clinicalRecords: true,
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
    patientId: string;
    veterinaryId?: string;
    operatorId?: string;
    dateTime: Date;
    durationMinutes?: number;
    appointmentType?: string;
    reason: string;
    notes?: string;
    createdBy?: string;
  }) {
    try {
      // Verificar que el paciente existe
      const patient = await prisma.patient.findUnique({
        where: { id: data.patientId },
        include: {
          owner: true,
        },
      });

      if (!patient) {
        throw new Error("El paciente especificado no existe");
      }

      const appointment = await prisma.appointment.create({
        data: {
          patientId: data.patientId,
          ownerId: patient.ownerId,
          veterinaryId: data.veterinaryId,
          operatorId: data.operatorId,
          dateTime: data.dateTime,
          durationMinutes: data.durationMinutes || 30,
          appointmentType: data.appointmentType,
          reason: data.reason,
          notes: data.notes,
          createdBy: data.createdBy,
        },
        include: {
          patient: {
            select: {
              id: true,
              name: true,
            },
          },
          owner: {
            select: {
              id: true,
              user: {
                select: {
                  fullName: true,
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
      dateTime?: Date;
      durationMinutes?: number;
      status?: AppointmentStatus;
      appointmentType?: string;
      reason?: string;
      notes?: string;
    }
  ) {
    try {
      const appointment = await prisma.appointment.update({
        where: { id: appointmentId },
        data,
        include: {
          patient: {
            select: {
              id: true,
              name: true,
            },
          },
          owner: {
            select: {
              id: true,
              user: {
                select: {
                  fullName: true,
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
          status: "cancelled",
          cancelledAt: new Date(),
          cancellationReason: reason,
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
