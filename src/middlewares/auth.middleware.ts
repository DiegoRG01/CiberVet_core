import { Request, Response, NextFunction } from "express";
import { supabase } from "../config/supabase";
import { UserPayload } from "../models/dto/auth.dto";

// Extender el tipo Request de Express para incluir el usuario
declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // Obtener el token del header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        error: "No autorizado",
        message: "Token de autenticación no proporcionado",
      });
      return;
    }

    const token = authHeader.substring(7); // Remover "Bearer "

    // Verificar el token con Supabase
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      res.status(401).json({
        error: "No autorizado",
        message: "Token de autenticación inválido o expirado",
      });
      return;
    }

    // Agregar el usuario al request
    req.user = {
      id: user.id,
      email: user.email!,
      role: user.user_metadata?.role || "owner",
    };

    next();
  } catch (error) {
    console.error("Error en middleware de autenticación:", error);
    res.status(500).json({
      error: "Error del servidor",
      message: "Error al verificar la autenticación",
    });
  }
};

export const authorize = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: "No autorizado",
        message: "Usuario no autenticado",
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        error: "Prohibido",
        message: "No tienes permisos para acceder a este recurso",
      });
      return;
    }

    next();
  };
};
