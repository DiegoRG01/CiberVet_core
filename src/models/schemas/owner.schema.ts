import { z } from "zod";

export const createOwnerSchema = z.object({
  usuarioId: z.string().uuid("usuarioId debe ser un UUID válido"),
  veterinariaId: z.string().uuid("veterinariaId debe ser un UUID válido").optional(),
  direccion: z.string().max(500).optional(),
  ciudad: z.string().max(100).optional(),
  nombreContactoEmergencia: z.string().max(255).optional(),
  telefonoContactoEmergencia: z.string().max(20).optional(),
  notas: z.string().optional(),
});

export const updateOwnerSchema = z.object({
  // Solo admin puede cambiar el usuario vinculado
  usuarioId: z.string().uuid("usuarioId debe ser un UUID válido").optional(),
  veterinariaId: z.string().uuid("veterinariaId debe ser un UUID válido").optional(),
  direccion: z.string().max(500).optional(),
  ciudad: z.string().max(100).optional(),
  nombreContactoEmergencia: z.string().max(255).optional(),
  telefonoContactoEmergencia: z.string().max(20).optional(),
  notas: z.string().optional(),
});

export type CreateOwnerDTO = z.infer<typeof createOwnerSchema>;
export type UpdateOwnerDTO = z.infer<typeof updateOwnerSchema>;
