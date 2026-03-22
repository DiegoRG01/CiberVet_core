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
        where: includeInactive ? undefined : { estaActivo: true },
        include: {
          _count: {
            select: {
              razas: true,
              pacientes: true,
            },
          },
        },
        orderBy: {
          nombre: "asc",
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
          razas: {
            where: { estaActivo: true },
            orderBy: { nombre: "asc" },
          },
          _count: {
            select: {
              razas: true,
              pacientes: true,
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
        data: {
          nombre: data.name,
          descripcion: data.description,
          estaActivo: data.isActive ?? true,
        },
        include: {
          _count: {
            select: {
              razas: true,
              pacientes: true,
            },
          },
        },
      });

      return species;
    } catch (error) {
      console.error("Error en SpeciesService.createSpecies:", error);
      throw error;
    }
  }

  async updateSpecies(speciesId: string, data: UpdateSpeciesDTO) {
    try {
      const species = await prisma.species.update({
        where: { id: speciesId },
        data: {
          ...(data.name !== undefined && { nombre: data.name }),
          ...(data.description !== undefined && {
            descripcion: data.description,
          }),
          ...(data.isActive !== undefined && { estaActivo: data.isActive }),
        },
        include: {
          _count: {
            select: {
              razas: true,
              pacientes: true,
            },
          },
        },
      });

      return species;
    } catch (error) {
      console.error("Error en SpeciesService.updateSpecies:", error);
      throw error;
    }
  }

  async deleteSpecies(speciesId: string) {
    try {
      const patientCount = await prisma.patient.count({
        where: { especieId: speciesId, estaActivo: true },
      });

      if (patientCount > 0) {
        const error: any = new Error(
          `No se puede desactivar: ${patientCount} paciente(s) activo(s) están asociados a esta especie. Reasigna o desactiva los pacientes primero.`,
        );
        error.code = "SPECIES_HAS_PATIENTS";
        error.patientCount = patientCount;
        throw error;
      }

      const [, species] = await prisma.$transaction([
        prisma.breed.updateMany({
          where: { especieId: speciesId, estaActivo: true },
          data: { estaActivo: false },
        }),
        prisma.species.update({
          where: { id: speciesId },
          data: { estaActivo: false },
        }),
      ]);

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
          especieId: speciesId,
          ...(includeInactive ? {} : { estaActivo: true }),
        },
        include: {
          especie: {
            select: {
              id: true,
              nombre: true,
            },
          },
          _count: {
            select: {
              pacientes: true,
            },
          },
        },
        orderBy: {
          nombre: "asc",
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
