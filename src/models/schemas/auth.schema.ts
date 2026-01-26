import { z } from "zod";

export const registerSchema = z.object({
  email: z
    .string({
      required_error: "El email es requerido",
    })
    .email("Debe ser un email válido"),
  password: z
    .string({
      required_error: "La contraseña es requerida",
    })
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .max(100, "La contraseña no puede tener más de 100 caracteres"),
  name: z
    .string({
      required_error: "El nombre es requerido",
    })
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede tener más de 100 caracteres"),
  role: z
    .enum(["owner", "operator", "admin"], {
      errorMap: () => ({ message: "El rol debe ser owner, operator o admin" }),
    })
    .default("owner"),
});

export const loginSchema = z.object({
  email: z
    .string({
      required_error: "El email es requerido",
    })
    .email("Debe ser un email válido"),
  password: z.string({
    required_error: "La contraseña es requerida",
  }),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string({
    required_error: "El refresh token es requerido",
  }),
});

export type RegisterDTO = z.infer<typeof registerSchema>;
export type LoginDTO = z.infer<typeof loginSchema>;
export type RefreshTokenDTO = z.infer<typeof refreshTokenSchema>;
