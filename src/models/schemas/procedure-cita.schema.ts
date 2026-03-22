import { z } from "zod";

export const createProcedureCitaSchema = z.object({
  procedimientoId: z.string().uuid(),
  citaId: z.string().uuid(),
  realizadoPor: z.string().uuid().optional(),
});

export type CreateProcedureCitaDTO = z.infer<typeof createProcedureCitaSchema>;
