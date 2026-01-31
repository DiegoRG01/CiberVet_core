import { z } from "zod";

// ============================================
// SPECIES SCHEMAS
// ============================================

export const createSpeciesSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es requerido")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

export const updateSpeciesSchema = createSpeciesSchema.partial();

export type CreateSpeciesDTO = z.infer<typeof createSpeciesSchema>;
export type UpdateSpeciesDTO = z.infer<typeof updateSpeciesSchema>;

// ============================================
// BREED SCHEMAS
// ============================================

export const createBreedSchema = z.object({
  speciesId: z.string().uuid("ID de especie inválido"),
  name: z
    .string()
    .min(1, "El nombre es requerido")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

export const updateBreedSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es requerido")
    .max(100, "El nombre no puede exceder 100 caracteres")
    .optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
});

export type CreateBreedDTO = z.infer<typeof createBreedSchema>;
export type UpdateBreedDTO = z.infer<typeof updateBreedSchema>;
