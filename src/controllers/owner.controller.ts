import { Request, Response } from "express";
import { ownerService } from "../services/owner.service";

export class OwnerController {
  async getAllOwners(req: Request, res: Response) {
    try {
      const includeInactive = req.query.includeInactive === "true";
      const owners = await ownerService.getAllOwners(includeInactive);
      res.status(200).json({ success: true, data: owners });
    } catch (error: any) {
      console.error("Error en OwnerController.getAllOwners:", error);
      res.status(500).json({ success: false, error: "Error del servidor", message: error.message });
    }
  }

  async getMyOwnerProfile(req: Request, res: Response) {
    try {
      const user = req.user!;
      const owner = await ownerService.getOwnerByUserId(user.id);

      if (!owner) {
        res.status(404).json({ success: false, error: "No encontrado", message: "No se encontró tu perfil de propietario" });
        return;
      }

      res.status(200).json({ success: true, data: owner });
    } catch (error: any) {
      console.error("Error en OwnerController.getMyOwnerProfile:", error);
      res.status(500).json({ success: false, error: "Error del servidor", message: error.message });
    }
  }

  async getOwnerById(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const owner = await ownerService.getOwnerById(id);

      if (!owner) {
        res.status(404).json({ success: false, error: "No encontrado", message: "Propietario no encontrado" });
        return;
      }

      res.status(200).json({ success: true, data: owner });
    } catch (error: any) {
      console.error("Error en OwnerController.getOwnerById:", error);
      res.status(500).json({ success: false, error: "Error del servidor", message: error.message });
    }
  }

  async createOwner(req: Request, res: Response) {
    try {
      const owner = await ownerService.createOwner(req.body);
      res.status(201).json({ success: true, data: owner, message: "Propietario creado exitosamente" });
    } catch (error: any) {
      console.error("Error en OwnerController.createOwner:", error);

      const knownErrors = [
        "El usuario especificado no existe",
        "Ya existe un propietario vinculado a ese usuario",
      ];

      if (knownErrors.includes(error.message)) {
        res.status(400).json({ success: false, error: "Validación", message: error.message });
        return;
      }

      res.status(500).json({ success: false, error: "Error del servidor", message: error.message });
    }
  }

  async updateOwner(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const user = req.user!;
      let data = req.body;

      // Solo admin puede cambiar el usuario vinculado
      if (user.role !== "admin") {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { usuarioId: _removed, ...rest } = data;
        data = rest;
      }

      // Propietario solo puede editar su propio perfil
      if (user.role === "propietario") {
        const owner = await ownerService.getOwnerByUserId(user.id);

        if (!owner || owner.id !== id) {
          res.status(403).json({ success: false, error: "Prohibido", message: "No tienes permisos para editar este propietario" });
          return;
        }
      }

      const updated = await ownerService.updateOwner(id, data);
      res.status(200).json({ success: true, data: updated, message: "Propietario actualizado exitosamente" });
    } catch (error: any) {
      console.error("Error en OwnerController.updateOwner:", error);

      if (error.code === "P2025") {
        res.status(404).json({ success: false, error: "No encontrado", message: "Propietario no encontrado" });
        return;
      }

      const knownErrors = [
        "El usuario especificado no existe",
        "Ese usuario ya está vinculado a otro propietario",
      ];

      if (knownErrors.includes(error.message)) {
        res.status(400).json({ success: false, error: "Validación", message: error.message });
        return;
      }

      res.status(500).json({ success: false, error: "Error del servidor", message: error.message });
    }
  }

  async deactivateOwner(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      await ownerService.deactivateOwner(id);
      res.status(200).json({ success: true, message: "Propietario desactivado exitosamente" });
    } catch (error: any) {
      console.error("Error en OwnerController.deactivateOwner:", error);

      if (error.message === "Propietario no encontrado") {
        res.status(404).json({ success: false, error: "No encontrado", message: error.message });
        return;
      }

      res.status(500).json({ success: false, error: "Error del servidor", message: error.message });
    }
  }
}

export const ownerController = new OwnerController();
