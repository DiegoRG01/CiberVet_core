import { Request, Response } from "express";
import { veterinarianService } from "../services/veterinarian.service";

export class VeterinarianController {
  async getAll(_req: Request, res: Response) {
    try {
      const veterinarians = await veterinarianService.getAll();
      res.status(200).json({ success: true, data: veterinarians });
    } catch (error: any) {
      console.error("Error en VeterinarianController.getAll:", error);
      res.status(500).json({
        success: false,
        error: "Error del servidor",
        message: error.message || "Error al obtener veterinarios",
      });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const veterinarian = await veterinarianService.getById(String(id));

      if (!veterinarian) {
        res.status(404).json({
          success: false,
          error: "No encontrado",
          message: "Veterinario no encontrado",
        });
        return;
      }

      res.status(200).json({ success: true, data: veterinarian });
    } catch (error: any) {
      console.error("Error en VeterinarianController.getById:", error);
      res.status(500).json({
        success: false,
        error: "Error del servidor",
        message: error.message || "Error al obtener veterinario",
      });
    }
  }
}

export const veterinarianController = new VeterinarianController();
