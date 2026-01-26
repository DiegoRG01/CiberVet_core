import { Request, Response } from "express";
import { userService } from "../services/user.service";

export class UserController {
  /**
   * Obtener todos los usuarios
   */
  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await userService.getAllUsers();

      res.status(200).json({
        success: true,
        data: users,
      });
    } catch (error: any) {
      console.error("Error en UserController.getAllUsers:", error);
      res.status(500).json({
        success: false,
        error: "Error del servidor",
        message: error.message || "Error al obtener usuarios",
      });
    }
  }

  /**
   * Obtener un usuario por ID
   */
  async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(id.toString());

      if (!user) {
        res.status(404).json({
          success: false,
          error: "No encontrado",
          message: "Usuario no encontrado",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error: any) {
      console.error("Error en UserController.getUserById:", error);
      res.status(500).json({
        success: false,
        error: "Error del servidor",
        message: error.message || "Error al obtener usuario",
      });
    }
  }

  /**
   * Actualizar un usuario
   */
  async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = req.body;

      const user = await userService.updateUser(id.toString(), data);

      res.status(200).json({
        success: true,
        data: user,
        message: "Usuario actualizado exitosamente",
      });
    } catch (error: any) {
      console.error("Error en UserController.updateUser:", error);
      res.status(500).json({
        success: false,
        error: "Error del servidor",
        message: error.message || "Error al actualizar usuario",
      });
    }
  }

  /**
   * Eliminar (desactivar) un usuario
   */
  async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await userService.deleteUser(id.toString());

      res.status(200).json({
        success: true,
        message: "Usuario desactivado exitosamente",
      });
    } catch (error: any) {
      console.error("Error en UserController.deleteUser:", error);
      res.status(500).json({
        success: false,
        error: "Error del servidor",
        message: error.message || "Error al eliminar usuario",
      });
    }
  }
}

export const userController = new UserController();
