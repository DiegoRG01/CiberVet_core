import { supabase } from "../config/supabase";
import { prisma } from "../config/prisma";
import { RegisterDTO, LoginDTO } from "../models/schemas/auth.schema";
import { AuthResponse } from "../models/dto/auth.dto";

export class AuthService {
  /**
   * Registrar un nuevo usuario
   */
  async register(data: RegisterDTO): Promise<AuthResponse> {
    try {
      // 1. Crear usuario en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            role: data.role,
          },
        },
      });

      if (authError) {
        throw new Error(`Error al crear usuario: ${authError.message}`);
      }

      if (!authData.user || !authData.session) {
        throw new Error("No se pudo crear el usuario o la sesión en Supabase");
      }

      // 2. Crear usuario en la base de datos
      const dbUser = await prisma.user.create({
        data: {
          id: authData.user.id,
          email: data.email,
          fullName: data.name,
          role: data.role,
        },
      });

      // 3. Crear registro específico según el rol
      if (data.role === "owner") {
        await prisma.owner.create({
          data: {
            userId: dbUser.id,
          },
        });
      }
      // Nota: Para operadores, se debe asignar un veterinaryId posteriormente
      // ya que es un campo requerido

      // 4. Retornar respuesta formateada
      return {
        user: {
          id: dbUser.id,
          email: dbUser.email,
          name: dbUser.fullName,
          role: dbUser.role,
        },
        session: {
          access_token: authData.session.access_token,
          refresh_token: authData.session.refresh_token,
          expires_in: authData.session.expires_in!,
          expires_at: authData.session.expires_at!,
        },
      };
    } catch (error) {
      console.error("Error en AuthService.register:", error);
      throw error;
    }
  }

  /**
   * Iniciar sesión
   */
  async login(data: LoginDTO): Promise<AuthResponse> {
    try {
      // 1. Autenticar con Supabase
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });

      if (authError) {
        throw new Error(`Error al iniciar sesión: ${authError.message}`);
      }

      if (!authData.user || !authData.session) {
        throw new Error("Credenciales inválidas");
      }

      // 2. Obtener datos del usuario de la base de datos
      const dbUser = await prisma.user.findUnique({
        where: { id: authData.user.id },
      });

      if (!dbUser) {
        throw new Error("Usuario no encontrado en la base de datos");
      }

      // 3. Retornar respuesta formateada
      return {
        user: {
          id: dbUser.id,
          email: dbUser.email,
          name: dbUser.fullName,
          role: dbUser.role,
        },
        session: {
          access_token: authData.session.access_token,
          refresh_token: authData.session.refresh_token,
          expires_in: authData.session.expires_in,
          expires_at: authData.session.expires_at!,
        },
      };
    } catch (error) {
      console.error("Error en AuthService.login:", error);
      throw error;
    }
  }

  /**
   * Refrescar el token de acceso
   */
  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      const { data: authData, error: authError } =
        await supabase.auth.refreshSession({
          refresh_token: refreshToken,
        });

      if (authError || !authData.session) {
        throw new Error("Token de refresco inválido");
      }

      const dbUser = await prisma.user.findUnique({
        where: { id: authData.user!.id },
      });

      if (!dbUser) {
        throw new Error("Usuario no encontrado");
      }

      return {
        user: {
          id: dbUser.id,
          email: dbUser.email,
          name: dbUser.fullName,
          role: dbUser.role,
        },
        session: {
          access_token: authData.session.access_token,
          refresh_token: authData.session.refresh_token,
          expires_in: authData.session.expires_in,
          expires_at: authData.session.expires_at!,
        },
      };
    } catch (error) {
      console.error("Error en AuthService.refreshToken:", error);
      throw error;
    }
  }

  /**
   * Cerrar sesión
   */
  async logout(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw new Error(`Error al cerrar sesión: ${error.message}`);
      }
    } catch (error) {
      console.error("Error en AuthService.logout:", error);
      throw error;
    }
  }

  /**
   * Obtener el usuario actual
   */
  async getCurrentUser(userId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          fullName: true,
          role: true,
          createdAt: true,
        },
      });

      if (!user) {
        return null;
      }

      return {
        ...user,
        name: user.fullName,
      };
    } catch (error) {
      console.error("Error en AuthService.getCurrentUser:", error);
      throw error;
    }
  }
}

export const authService = new AuthService();
