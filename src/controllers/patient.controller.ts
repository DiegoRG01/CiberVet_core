import { Request, Response } from "express";
import { patientService } from "../services/patient.service";

export class PatientController {
  async getAllPatients(req: Request, res: Response) {
    try {
      const includeInactive = req.query.includeInactive === "true";
      const user = req.user!;

      let patients;

      if (user.role === "propietario") {
        patients = await patientService.getPatientsByOwnerUserId(user.id, includeInactive);
      } else {
        patients = await patientService.getAllPatients(includeInactive);
      }

      res.status(200).json({ success: true, data: patients });
    } catch (error: any) {
      console.error("Error en PatientController.getAllPatients:", error);
      res.status(500).json({
        success: false,
        error: "Error del servidor",
        message: error.message || "Error al obtener pacientes",
      });
    }
  }

  async getPatientById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = req.user!;

      const patient = await patientService.getPatientById(id);

      if (!patient) {
        res.status(404).json({
          success: false,
          error: "No encontrado",
          message: "Paciente no encontrado",
        });
        return;
      }

      // Los propietarios solo pueden ver sus propios pacientes
      if (user.role === "propietario") {
        const isOwner = patient.propietario?.usuario?.id === user.id;

        if (!isOwner) {
          res.status(403).json({
            success: false,
            error: "Prohibido",
            message: "No tienes permisos para ver este paciente",
          });
          return;
        }
      }

      res.status(200).json({ success: true, data: patient });
    } catch (error: any) {
      console.error("Error en PatientController.getPatientById:", error);
      res.status(500).json({
        success: false,
        error: "Error del servidor",
        message: error.message || "Error al obtener paciente",
      });
    }
  }

  async createPatient(req: Request, res: Response) {
    try {
      const user = req.user!;
      let data = req.body;

      // Si es propietario, el ownerId debe resolverse desde su User.id
      if (user.role === "propietario") {
        const { prisma } = await import("../config/prisma");
        const owner = await prisma.owner.findUnique({
          where: { usuarioId: user.id },
        });

        if (!owner) {
          res.status(400).json({
            success: false,
            error: "Validación",
            message: "No se encontró el perfil de propietario asociado a tu cuenta",
          });
          return;
        }

        data = { ...data, ownerId: owner.id };
      }

      const patient = await patientService.createPatient(data);

      res.status(201).json({
        success: true,
        data: patient,
        message: "Paciente creado exitosamente",
      });
    } catch (error: any) {
      console.error("Error en PatientController.createPatient:", error);

      const knownErrors = [
        "El propietario especificado no existe",
        "La especie especificada no existe",
        "La raza especificada no existe",
      ];

      if (knownErrors.includes(error.message)) {
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
        message: error.message || "Error al crear paciente",
      });
    }
  }

  async updatePatient(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = req.user!;

      // Verificar que el propietario solo edite sus propios pacientes
      if (user.role === "propietario") {
        const existing = await patientService.getPatientById(id);

        if (!existing) {
          res.status(404).json({
            success: false,
            error: "No encontrado",
            message: "Paciente no encontrado",
          });
          return;
        }

        const isOwner = existing.propietario?.usuario?.id === user.id;

        if (!isOwner) {
          res.status(403).json({
            success: false,
            error: "Prohibido",
            message: "No tienes permisos para editar este paciente",
          });
          return;
        }
      }

      const patient = await patientService.updatePatient(id, req.body);

      res.status(200).json({
        success: true,
        data: patient,
        message: "Paciente actualizado exitosamente",
      });
    } catch (error: any) {
      console.error("Error en PatientController.updatePatient:", error);

      if (error.code === "P2025") {
        res.status(404).json({
          success: false,
          error: "No encontrado",
          message: "Paciente no encontrado",
        });
        return;
      }

      const knownErrors = [
        "La especie especificada no existe",
        "La raza especificada no existe",
      ];

      if (knownErrors.includes(error.message)) {
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
        message: error.message || "Error al actualizar paciente",
      });
    }
  }

  async deactivatePatient(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await patientService.deactivatePatient(id);

      res.status(200).json({
        success: true,
        message: "Paciente desactivado exitosamente",
      });
    } catch (error: any) {
      console.error("Error en PatientController.deactivatePatient:", error);

      if (error.code === "P2025") {
        res.status(404).json({
          success: false,
          error: "No encontrado",
          message: "Paciente no encontrado",
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: "Error del servidor",
        message: error.message || "Error al desactivar paciente",
      });
    }
  }
}

export const patientController = new PatientController();
