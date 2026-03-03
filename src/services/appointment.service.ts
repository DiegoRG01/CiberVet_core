import { v4 as uuidv4 } from "uuid";

let fakeAppointments: any[] = [];

export class AppointmentService {
  async getAllAppointments() {
    return fakeAppointments;
  }

  async getAppointmentById(appointmentId: string) {
    return fakeAppointments.find(a => a.id === appointmentId);
  }

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
    const newAppointment = {
      id: uuidv4(),
      ...data,
      estado: "programada",
      creadoEn: new Date(),
    };

    fakeAppointments.push(newAppointment);

    return newAppointment;
  }

  async updateAppointment(appointmentId: string, data: any) {
    const index = fakeAppointments.findIndex(a => a.id === appointmentId);

    if (index === -1) {
      throw new Error("Cita no encontrada");
    }

    fakeAppointments[index] = {
      ...fakeAppointments[index],
      ...data,
    };

    return fakeAppointments[index];
  }

  async cancelAppointment(appointmentId: string, reason?: string) {
    const appointment = fakeAppointments.find(a => a.id === appointmentId);

    if (!appointment) {
      throw new Error("Cita no encontrada");
    }

    appointment.estado = "cancelada";
    appointment.motivoCancelacion = reason;
    appointment.canceladoEn = new Date();

    return appointment;
  }
}

export const appointmentService = new AppointmentService();