import { Request, Response } from "express";
import { breedService } from "../services/breed.service";

export class BreedController {
  /**
   * Obtener todas las razas
   */
  async getAllBreeds(req: Request, res: Response) {
    try {
      const includeInactive = req.query.includeInactive === "true";
      const breeds = await breedService.getAllBreeds(includeInactive);

      res.status(200).json({
        success: true,
        data: breeds,
      });
    } catch (error: any) {
      console.error("Error en BreedController.getAllBreeds:", error);
      res.status(500).json({
        success: false,
        error: "Error del servidor",
        message: error.message || "Error al obtener razas",
      });
    }
  }

  /**
   * Obtener una raza por ID
   */
  async getBreedById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const breed = await breedService.getBreedById(id.toString());

      if (!breed) {
        res.status(404).json({
          success: false,
          error: "No encontrado",
          message: "Raza no encontrada",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: breed,
      });
    } catch (error: any) {
      console.error("Error en BreedController.getBreedById:", error);
      res.status(500).json({
        success: false,
        error: "Error del servidor",
        message: error.message || "Error al obtener raza",
      });
    }
  }

  /**
   * Crear una nueva raza
   */
  async createBreed(req: Request, res: Response) {
    try {
      const data = req.body;
      const breed = await breedService.createBreed(data);

      res.status(201).json({
        success: true,
        data: breed,
        message: "Raza creada exitosamente",
      });
    } catch (error: any) {
      console.error("Error en BreedController.createBreed:", error);

      // Manejo de errores específicos de Prisma
      if (error.code === "P2002") {
        res.status(400).json({
          success: false,
          error: "Conflicto",
          message: "Ya existe una raza con ese nombre para esta especie",
        });
        return;
      }

      if (error.message === "La especie especificada no existe") {
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
        message: error.message || "Error al crear raza",
      });
    }
  }

  /**
   * Actualizar una raza
   */
  async updateBreed(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = req.body;

      const breed = await breedService.updateBreed(id.toString(), data);

      res.status(200).json({
        success: true,
        data: breed,
        message: "Raza actualizada exitosamente",
      });
    } catch (error: any) {
      console.error("Error en BreedController.updateBreed:", error);

      if (error.code === "P2025") {
        res.status(404).json({
          success: false,
          error: "No encontrado",
          message: "Raza no encontrada",
        });
        return;
      }

      if (error.code === "P2002") {
        res.status(400).json({
          success: false,
          error: "Conflicto",
          message: "Ya existe una raza con ese nombre para esta especie",
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: "Error del servidor",
        message: error.message || "Error al actualizar raza",
      });
    }
  }

  /**
   * Eliminar (desactivar) una raza
   */
  async deleteBreed(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await breedService.deleteBreed(id.toString());

      res.status(200).json({
        success: true,
        message: "Raza desactivada exitosamente",
      });
    } catch (error: any) {
      console.error("Error en BreedController.deleteBreed:", error);

      if (error.code === "P2025") {
        res.status(404).json({
          success: false,
          error: "No encontrado",
          message: "Raza no encontrada",
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: "Error del servidor",
        message: error.message || "Error al eliminar raza",
      });
    }
  }
}

export const breedController = new BreedController();
