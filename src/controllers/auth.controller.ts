import { Request, Response } from "express";
import { authService } from "../services/auth.service";
import { RegisterDTO, LoginDTO } from "../models/schemas/auth.schema";

export class AuthController {
  /**
   * POST /api/v1/auth/register
   */
  async register(req: Request, res: Response): Promise<void> {
    try {
      const data: RegisterDTO = req.body;
      const result = await authService.register(data);

      res.status(201).json({
        success: true,
        message: "Usuario registrado exitosamente",
        data: result,
      });
    } catch (error: any) {
      console.error("Error en register:", error);
      res.status(400).json({
        success: false,
        error: "Error al registrar usuario",
        message: error.message || "Error desconocido",
      });
    }
  }

  /**
   * POST /api/v1/auth/login
   */
  async login(req: Request, res: Response): Promise<void> {
    try {
      const data: LoginDTO = req.body;
      const result = await authService.login(data);

      res.status(200).json({
        success: true,
        message: "Inicio de sesión exitoso",
        data: result,
      });
    } catch (error: any) {
      console.error("Error en login:", error);
      res.status(401).json({
        success: false,
        error: "Error al iniciar sesión",
        message: error.message || "Credenciales inválidas",
      });
    }
  }

  /**
   * POST /api/v1/auth/refresh
   */
  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        res.status(400).json({
          success: false,
          error: "Token de refresco requerido",
        });
        return;
      }

      const result = await authService.refreshToken(refreshToken);

      res.status(200).json({
        success: true,
        message: "Token refrescado exitosamente",
        data: result,
      });
    } catch (error: any) {
      console.error("Error en refreshToken:", error);
      res.status(401).json({
        success: false,
        error: "Error al refrescar token",
        message: error.message || "Token inválido",
      });
    }
  }

  /**
   * POST /api/v1/auth/logout
   */
  async logout(req: Request, res: Response): Promise<void> {
    try {
      await authService.logout();

      res.status(200).json({
        success: true,
        message: "Sesión cerrada exitosamente",
      });
    } catch (error: any) {
      console.error("Error en logout:", error);
      res.status(500).json({
        success: false,
        error: "Error al cerrar sesión",
        message: error.message || "Error desconocido",
      });
    }
  }

  /**
   * GET /api/v1/auth/me
   */
  async getCurrentUser(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: "No autenticado",
        });
        return;
      }

      const user = await authService.getCurrentUser(req.user.id);

      if (!user) {
        res.status(404).json({
          success: false,
          error: "Usuario no encontrado",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error: any) {
      console.error("Error en getCurrentUser:", error);
      res.status(500).json({
        success: false,
        error: "Error al obtener usuario",
        message: error.message || "Error desconocido",
      });
    }
  }
}

export const authController = new AuthController();
