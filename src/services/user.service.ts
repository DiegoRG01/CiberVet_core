import { prisma } from "../config/prisma";
import { UserRole } from "../generated/prisma/enums";

export class UserService {
  /**
   * Obtener todos los usuarios
   */
  async getAllUsers() {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          fullName: true,
          phone: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return users;
    } catch (error) {
      console.error("Error en UserService.getAllUsers:", error);
      throw error;
    }
  }

  /**
   * Obtener un usuario por ID
   */
  async getUserById(userId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          fullName: true,
          phone: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return user;
    } catch (error) {
      console.error("Error en UserService.getUserById:", error);
      throw error;
    }
  }

  /**
   * Actualizar un usuario
   */
  async updateUser(
    userId: string,
    data: {
      fullName?: string;
      phone?: string;
      role?: UserRole;
      isActive?: boolean;
    },
  ) {
    try {
      const user = await prisma.user.update({
        where: { id: userId },
        data,
        select: {
          id: true,
          email: true,
          fullName: true,
          phone: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return user;
    } catch (error) {
      console.error("Error en UserService.updateUser:", error);
      throw error;
    }
  }

  /**
   * Eliminar (desactivar) un usuario
   */
  async deleteUser(userId: string) {
    try {
      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          isActive: false,
        },
      });

      return user;
    } catch (error) {
      console.error("Error en UserService.deleteUser:", error);
      throw error;
    }
  }
}

export const userService = new UserService();
