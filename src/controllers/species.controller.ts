import { Request, Response } from "express";
import { speciesService } from "../services/species.service";

export class SpeciesController {
  /**
   * Obtener todas las especies
   */
  async getAllSpecies(req: Request, res: Response) {
    try {
      const includeInactive = req.query.includeInactive === "true";
      const species = await speciesService.getAllSpecies(includeInactive);

      res.status(200).json({
        success: true,
        data: species,
      });
    } catch (error: any) {
      console.error("Error en SpeciesController.getAllSpecies:", error);
      res.status(500).json({
        success: false,
        error: "Error del servidor",
        message: error.message || "Error al obtener especies",
      });
    }
  }

  /**
   * Obtener una especie por ID
   */
  async getSpeciesById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const species = await speciesService.getSpeciesById(id.toString());

      if (!species) {
        res.status(404).json({
          success: false,
          error: "No encontrado",
          message: "Especie no encontrada",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: species,
      });
    } catch (error: any) {
      console.error("Error en SpeciesController.getSpeciesById:", error);
      res.status(500).json({
        success: false,
        error: "Error del servidor",
        message: error.message || "Error al obtener especie",
      });
    }
  }

  /**
   * Crear una nueva especie
   */
  async createSpecies(req: Request, res: Response) {
    try {
      const data = req.body;
      const species = await speciesService.createSpecies(data);

      res.status(201).json({
        success: true,
        data: species,
        message: "Especie creada exitosamente",
      });
    } catch (error: any) {
      console.error("Error en SpeciesController.createSpecies:", error);

      // Manejo de errores específicos de Prisma
      if (error.code === "P2002") {
        res.status(400).json({
          success: false,
          error: "Conflicto",
          message: "Ya existe una especie con ese nombre",
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: "Error del servidor",
        message: error.message || "Error al crear especie",
      });
    }
  }

  /**
   * Actualizar una especie
   */
  async updateSpecies(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = req.body;

      const species = await speciesService.updateSpecies(id.toString(), data);

      res.status(200).json({
        success: true,
        data: species,
        message: "Especie actualizada exitosamente",
      });
    } catch (error: any) {
      console.error("Error en SpeciesController.updateSpecies:", error);

      if (error.code === "P2025") {
        res.status(404).json({
          success: false,
          error: "No encontrado",
          message: "Especie no encontrada",
        });
        return;
      }

      if (error.code === "P2002") {
        res.status(400).json({
          success: false,
          error: "Conflicto",
          message: "Ya existe una especie con ese nombre",
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: "Error del servidor",
        message: error.message || "Error al actualizar especie",
      });
    }
  }

  /**
   * Eliminar (desactivar) una especie
   */
  async deleteSpecies(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await speciesService.deleteSpecies(id.toString());

      res.status(200).json({
        success: true,
        message: "Especie desactivada exitosamente",
      });
    } catch (error: any) {
      console.error("Error en SpeciesController.deleteSpecies:", error);

      if (error.code === "P2025") {
        res.status(404).json({
          success: false,
          error: "No encontrado",
          message: "Especie no encontrada",
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: "Error del servidor",
        message: error.message || "Error al eliminar especie",
      });
    }
  }

  /**
   * Obtener razas de una especie
   */
  async getBreedsBySpecies(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const includeInactive = req.query.includeInactive === "true";

      const breeds = await speciesService.getBreedsBySpecies(
        id.toString(),
        includeInactive,
      );

      res.status(200).json({
        success: true,
        data: breeds,
      });
    } catch (error: any) {
      console.error("Error en SpeciesController.getBreedsBySpecies:", error);
      res.status(500).json({
        success: false,
        error: "Error del servidor",
        message: error.message || "Error al obtener razas",
      });
    }
  }
}

export const speciesController = new SpeciesController();
