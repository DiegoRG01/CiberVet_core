import { prisma } from "../config/prisma";
import {
  CreateSpeciesDTO,
  UpdateSpeciesDTO,
} from "../models/schemas/species.schema";

export class SpeciesService {
  /**
   * Obtener todas las especies
   */
  async getAllSpecies(includeInactive: boolean = false) {
    try {
      const species = await prisma.species.findMany({
        where: includeInactive ? undefined : { isActive: true },
        include: {
          _count: {
            select: {
              breeds: true,
              patients: true,
            },
          },
        },
        orderBy: {
          name: "asc",
        },
      });

      return species;
    } catch (error) {
      console.error("Error en SpeciesService.getAllSpecies:", error);
      throw error;
    }
  }

  /**
   * Obtener una especie por ID
   */
  async getSpeciesById(speciesId: string) {
    try {
      const species = await prisma.species.findUnique({
        where: { id: speciesId },
        include: {
          breeds: {
            where: { isActive: true },
            orderBy: { name: "asc" },
          },
          _count: {
            select: {
              breeds: true,
              patients: true,
            },
          },
        },
      });

      return species;
    } catch (error) {
      console.error("Error en SpeciesService.getSpeciesById:", error);
      throw error;
    }
  }

  /**
   * Crear una nueva especie
   */
  async createSpecies(data: CreateSpeciesDTO) {
    try {
      const species = await prisma.species.create({
        data,
      });

      return species;
    } catch (error) {
      console.error("Error en SpeciesService.createSpecies:", error);
      throw error;
    }
  }

  /**
   * Actualizar una especie
   */
  async updateSpecies(speciesId: string, data: UpdateSpeciesDTO) {
    try {
      const species = await prisma.species.update({
        where: { id: speciesId },
        data,
      });

      return species;
    } catch (error) {
      console.error("Error en SpeciesService.updateSpecies:", error);
      throw error;
    }
  }

  /**
   * Eliminar (desactivar) una especie
   */
  async deleteSpecies(speciesId: string) {
    try {
      const species = await prisma.species.update({
        where: { id: speciesId },
        data: { isActive: false },
      });

      return species;
    } catch (error) {
      console.error("Error en SpeciesService.deleteSpecies:", error);
      throw error;
    }
  }

  /**
   * Obtener razas de una especie
   */
  async getBreedsBySpecies(
    speciesId: string,
    includeInactive: boolean = false,
  ) {
    try {
      const breeds = await prisma.breed.findMany({
        where: {
          speciesId,
          ...(includeInactive ? {} : { isActive: true }),
        },
        include: {
          _count: {
            select: {
              patients: true,
            },
          },
        },
        orderBy: {
          name: "asc",
        },
      });

      return breeds;
    } catch (error) {
      console.error("Error en SpeciesService.getBreedsBySpecies:", error);
      throw error;
    }
  }
}

export const speciesService = new SpeciesService();
