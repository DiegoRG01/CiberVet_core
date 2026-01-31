import { prisma } from "../config/prisma";
import {
  CreateBreedDTO,
  UpdateBreedDTO,
} from "../models/schemas/species.schema";

export class BreedService {
  /**
   * Obtener todas las razas
   */
  async getAllBreeds(includeInactive: boolean = false) {
    try {
      const breeds = await prisma.breed.findMany({
        where: includeInactive ? undefined : { isActive: true },
        include: {
          species: {
            select: {
              id: true,
              name: true,
            },
          },
          _count: {
            select: {
              patients: true,
            },
          },
        },
        orderBy: [{ species: { name: "asc" } }, { name: "asc" }],
      });

      return breeds;
    } catch (error) {
      console.error("Error en BreedService.getAllBreeds:", error);
      throw error;
    }
  }

  /**
   * Obtener una raza por ID
   */
  async getBreedById(breedId: string) {
    try {
      const breed = await prisma.breed.findUnique({
        where: { id: breedId },
        include: {
          species: {
            select: {
              id: true,
              name: true,
            },
          },
          _count: {
            select: {
              patients: true,
            },
          },
        },
      });

      return breed;
    } catch (error) {
      console.error("Error en BreedService.getBreedById:", error);
      throw error;
    }
  }

  /**
   * Crear una nueva raza
   */
  async createBreed(data: CreateBreedDTO) {
    try {
      // Verificar que la especie existe
      const species = await prisma.species.findUnique({
        where: { id: data.speciesId },
      });

      if (!species) {
        throw new Error("La especie especificada no existe");
      }

      const breed = await prisma.breed.create({
        data,
        include: {
          species: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return breed;
    } catch (error) {
      console.error("Error en BreedService.createBreed:", error);
      throw error;
    }
  }

  /**
   * Actualizar una raza
   */
  async updateBreed(breedId: string, data: UpdateBreedDTO) {
    try {
      const breed = await prisma.breed.update({
        where: { id: breedId },
        data,
        include: {
          species: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return breed;
    } catch (error) {
      console.error("Error en BreedService.updateBreed:", error);
      throw error;
    }
  }

  /**
   * Eliminar (desactivar) una raza
   */
  async deleteBreed(breedId: string) {
    try {
      const breed = await prisma.breed.update({
        where: { id: breedId },
        data: { isActive: false },
      });

      return breed;
    } catch (error) {
      console.error("Error en BreedService.deleteBreed:", error);
      throw error;
    }
  }
}

export const breedService = new BreedService();
