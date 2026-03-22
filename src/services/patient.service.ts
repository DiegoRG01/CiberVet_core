import { prisma } from "../config/prisma";
import { CreatePatientDTO, UpdatePatientDTO } from "../models/schemas/patient.schema";

const PATIENT_INCLUDE = {
  especie: { select: { id: true, nombre: true } },
  raza: { select: { id: true, nombre: true } },
  propietario: {
    select: {
      id: true,
      usuario: {
        select: {
          id: true,
          nombreCompleto: true,
          correo: true,
          telefono: true,
        },
      },
    },
  },
} as const;

const PATIENT_DETAIL_INCLUDE = {
  ...PATIENT_INCLUDE,
  citas: {
    orderBy: { fechaHora: "desc" as const },
    include: {
      procedimientos: {
        orderBy: { creadoEn: "desc" as const },
      },
      operador: {
        select: {
          id: true,
          usuario: { select: { nombreCompleto: true } },
        },
      },
    },
  },
  registrosClinico: {
    orderBy: { creadoEn: "desc" as const },
  },
} as const;

export class PatientService {
  async getAllPatients(includeInactive: boolean = false) {
    try {
      return await prisma.patient.findMany({
        where: includeInactive ? undefined : { estaActivo: true },
        include: PATIENT_INCLUDE,
        orderBy: { nombre: "asc" },
      });
    } catch (error) {
      console.error("Error en PatientService.getAllPatients:", error);
      throw error;
    }
  }

  async getPatientsByOwnerUserId(userId: string, includeInactive: boolean = false) {
    try {
      const owner = await prisma.owner.findUnique({
        where: { usuarioId: userId },
      });

      if (!owner) {
        return [];
      }

      return await prisma.patient.findMany({
        where: {
          propietarioId: owner.id,
          ...(includeInactive ? {} : { estaActivo: true }),
        },
        include: PATIENT_INCLUDE,
        orderBy: { nombre: "asc" },
      });
    } catch (error) {
      console.error("Error en PatientService.getPatientsByOwnerUserId:", error);
      throw error;
    }
  }

  async getPatientById(patientId: string) {
    try {
      return await prisma.patient.findUnique({
        where: { id: patientId },
        include: PATIENT_DETAIL_INCLUDE,
      });
    } catch (error) {
      console.error("Error en PatientService.getPatientById:", error);
      throw error;
    }
  }

  async createPatient(data: CreatePatientDTO) {
    try {
      const owner = await prisma.owner.findUnique({
        where: { id: data.ownerId },
      });

      if (!owner) {
        throw new Error("El propietario especificado no existe");
      }

      const species = await prisma.species.findUnique({
        where: { id: data.speciesId },
      });

      if (!species) {
        throw new Error("La especie especificada no existe");
      }

      if (data.breedId) {
        const breed = await prisma.breed.findUnique({
          where: { id: data.breedId },
        });

        if (!breed) {
          throw new Error("La raza especificada no existe");
        }
      }

      return await prisma.patient.create({
        data: {
          propietarioId: data.ownerId,
          especieId: data.speciesId,
          ...(data.breedId && { razaId: data.breedId }),
          nombre: data.name,
          color: data.color,
          ...(data.birthDate && { fechaNacimiento: new Date(data.birthDate) }),
          genero: data.gender,
          peso: data.weight,
          numeroMicrochip: data.microchipNumber,
          estaCastrado: data.isNeutered ?? false,
          alergias: data.allergies,
          condicionesEspeciales: data.specialConditions,
        },
        include: PATIENT_INCLUDE,
      });
    } catch (error) {
      console.error("Error en PatientService.createPatient:", error);
      throw error;
    }
  }

  async updatePatient(patientId: string, data: UpdatePatientDTO) {
    try {
      if (data.ownerId) {
        const owner = await prisma.owner.findUnique({
          where: { id: data.ownerId },
        });

        if (!owner) {
          throw new Error("El propietario especificado no existe");
        }
      }

      if (data.speciesId) {
        const species = await prisma.species.findUnique({
          where: { id: data.speciesId },
        });

        if (!species) {
          throw new Error("La especie especificada no existe");
        }
      }

      if (data.breedId) {
        const breed = await prisma.breed.findUnique({
          where: { id: data.breedId },
        });

        if (!breed) {
          throw new Error("La raza especificada no existe");
        }
      }

      return await prisma.patient.update({
        where: { id: patientId },
        data: {
          ...(data.ownerId !== undefined && { propietarioId: data.ownerId }),
          ...(data.speciesId !== undefined && { especieId: data.speciesId }),
          ...(data.breedId !== undefined && { razaId: data.breedId }),
          ...(data.name !== undefined && { nombre: data.name }),
          ...(data.color !== undefined && { color: data.color }),
          ...(data.birthDate !== undefined && { fechaNacimiento: new Date(data.birthDate) }),
          ...(data.gender !== undefined && { genero: data.gender }),
          ...(data.weight !== undefined && { peso: data.weight }),
          ...(data.microchipNumber !== undefined && { numeroMicrochip: data.microchipNumber }),
          ...(data.isNeutered !== undefined && { estaCastrado: data.isNeutered }),
          ...(data.allergies !== undefined && { alergias: data.allergies }),
          ...(data.specialConditions !== undefined && { condicionesEspeciales: data.specialConditions }),
        },
        include: PATIENT_INCLUDE,
      });
    } catch (error) {
      console.error("Error en PatientService.updatePatient:", error);
      throw error;
    }
  }

  async deactivatePatient(patientId: string) {
    try {
      return await prisma.patient.update({
        where: { id: patientId },
        data: { estaActivo: false },
      });
    } catch (error) {
      console.error("Error en PatientService.deactivatePatient:", error);
      throw error;
    }
  }
}

export const patientService = new PatientService();
