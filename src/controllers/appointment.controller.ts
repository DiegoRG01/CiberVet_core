import { Request, Response } from "express";
import { appointmentService } from "../services/appointment.service";
import { AppointmentStatus } from "../generated/prisma/enums";

export class AppointmentController {
  /**
   * Obtener todas las citas
   */
  async getAllAppointments(req: Request, res: Response) {
    try {
      const status = req.query.status as AppointmentStatus | undefined;

      // Validar que el status sea válido si se proporciona
      if (status) {
        const validStatuses: AppointmentStatus[] = [
          "scheduled",
          "confirmed",
          "in_progress",
          "completed",
          "cancelled",
          "no_show",
        ];
        if (!validStatuses.includes(status)) {
          res.status(400).json({
            success: false,
            error: "Validación",
            message: "Estado de cita inválido",
          });
          return;
        }
      }

      const appointments = await appointmentService.getAllAppointments(status);

      res.status(200).json({
        success: true,
        data: appointments,
      });
    } catch (error: any) {
      console.error("Error en AppointmentController.getAllAppointments:", error);
      res.status(500).json({
        success: false,
        error: "Error del servidor",
        message: error.message || "Error al obtener citas",
      });
    }
  }

  /**
   * Obtener una cita por ID
   */
  async getAppointmentById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const appointment = await appointmentService.getAppointmentById(
        id.toString()
      );

      if (!appointment) {
        res.status(404).json({
          success: false,
          error: "No encontrado",
          message: "Cita no encontrada",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: appointment,
      });
    } catch (error: any) {
      console.error("Error en AppointmentController.getAppointmentById:", error);
      res.status(500).json({
        success: false,
        error: "Error del servidor",
        message: error.message || "Error al obtener cita",
      });
    }
  }

  /**
   * Crear una nueva cita
   */
  async createAppointment(req: Request, res: Response) {
    try {
      const data = req.body;
      const appointment = await appointmentService.createAppointment(data);

      res.status(201).json({
        success: true,
        data: appointment,
        message: "Cita creada exitosamente",
      });
    } catch (error: any) {
      console.error("Error en AppointmentController.createAppointment:", error);

      if (error.message === "El paciente especificado no existe") {
        res.status(400).json({
          success: false,
          error: "Validación",
          message: error.message,
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: "Error del servidor",
        message: error.message || "Error al crear cita",
      });
    }
  }

  /**
   * Actualizar una cita
   */
  async updateAppointment(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = req.body;

      const appointment = await appointmentService.updateAppointment(
        id.toString(),
        data
      );

      res.status(200).json({
        success: true,
        data: appointment,
        message: "Cita actualizada exitosamente",
      });
    } catch (error: any) {
      console.error("Error en AppointmentController.updateAppointment:", error);

      if (error.code === "P2025") {
        res.status(404).json({
          success: false,
          error: "No encontrado",
          message: "Cita no encontrada",
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: "Error del servidor",
        message: error.message || "Error al actualizar cita",
      });
    }
  }

  /**
   * Cancelar una cita
   */
  async cancelAppointment(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      await appointmentService.cancelAppointment(id.toString(), reason);

      res.status(200).json({
        success: true,
        message: "Cita cancelada exitosamente",
      });
    } catch (error: any) {
      console.error("Error en AppointmentController.cancelAppointment:", error);

      if (error.code === "P2025") {
        res.status(404).json({
          success: false,
          error: "No encontrado",
          message: "Cita no encontrada",
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: "Error del servidor",
        message: error.message || "Error al cancelar cita",
      });
    }
  }
}

export const appointmentController = new AppointmentController();
