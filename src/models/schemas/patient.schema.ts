import { z } from 'zod';

export const createPatientSchema = z.object({
  ownerId:           z.string().uuid("ownerId debe ser un UUID válido"),
  speciesId:         z.string().uuid("speciesId debe ser un UUID válido"),
  breedId:           z.string().uuid("breedId debe ser un UUID válido").optional(),
  name:              z.string().min(1, "El nombre es requerido").max(255),
  color:             z.string().max(100).optional(),
  birthDate:         z.string().date("Formato de fecha inválido (YYYY-MM-DD)").optional(),
  gender:            z.enum(['Macho', 'Hembra'], { errorMap: () => ({ message: "El género debe ser Macho o Hembra" }) }).optional(),
  weight:            z.number().positive("El peso debe ser un número positivo").optional(),
  microchipNumber:   z.string().max(50).optional(),
  isNeutered:        z.boolean().default(false),
  allergies:         z.string().optional(),
  specialConditions: z.string().optional(),
});

export const updatePatientSchema = createPatientSchema.omit({ ownerId: true }).partial().extend({
  ownerId: z.string().uuid("ownerId debe ser un UUID válido").optional(),
});

export type CreatePatientDTO = z.infer<typeof createPatientSchema>;
export type UpdatePatientDTO = z.infer<typeof updatePatientSchema>;

