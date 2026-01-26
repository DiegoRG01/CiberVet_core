import { z } from 'zod';

export const createPatientSchema = z.object({
  ownerId: z.string().uuid(),
  veterinaryId: z.string().uuid(),
  name: z.string().min(1),
  species: z.string().min(1),
  breed: z.string().optional(),
  color: z.string().optional(),
  birthDate: z.string().date().optional(),
  gender: z.enum(['Macho', 'Hembra']).optional(),
  weight: z.number().positive().optional(),
  microchipNumber: z.string().optional(),
  isNeutered: z.boolean().default(false),
  allergies: z.string().optional(),
  specialConditions: z.string().optional(),
});

export const updatePatientSchema = createPatientSchema.partial();

export type CreatePatientDTO = z.infer<typeof createPatientSchema>;
export type UpdatePatientDTO = z.infer<typeof updatePatientSchema>;
