import { z } from "zod";

export const createProcedureSchema = z.object({
  nombre: z.string().min(1).max(255),
  descripcion: z.string().optional(),
  costo: z.number().positive().optional(),
  duracionMinutos: z.number().int().positive().optional(),
  estaActivo: z.boolean().default(true),
});

export const updateProcedureSchema = createProcedureSchema.partial();

export type CreateProcedureDTO = z.infer<typeof createProcedureSchema>;
export type UpdateProcedureDTO = z.infer<typeof updateProcedureSchema>;
