import { Request, Response, NextFunction } from "express";
import { supabase } from "../config/supabase";
import { prisma } from "../config/prisma";
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

    // Obtener datos del usuario desde la base de datos para tener el rol correcto
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        correo: true,
        nombreCompleto: true,
        rol: true,
        estaActivo: true,
      },
    });

    if (!dbUser) {
      res.status(401).json({
        error: "No autorizado",
        message: "Usuario no encontrado en la base de datos",
      });
      return;
    }

    // Agregar el usuario al request con los datos de la BD
    req.user = {
      id: dbUser.id,
      email: dbUser.correo,
      role: dbUser.rol,
      fullName: dbUser.nombreCompleto,
      isActive: dbUser.estaActivo,
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
