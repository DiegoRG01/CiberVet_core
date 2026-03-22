import { Request, Response } from "express";
import { procedureCitaService } from "../services/procedure-cita.service";

export class ProcedureCitaController {
  async getByAppointment(req: Request, res: Response) {
    try {
      const citaId = req.params.citaId as string;
      const items = await procedureCitaService.getByAppointment(citaId);
      res.status(200).json({ success: true, data: items });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const item = await procedureCitaService.create(req.body);
      res.status(201).json({ success: true, data: item });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const existing = await procedureCitaService.getById(id);
      if (!existing) {
        res.status(404).json({ success: false, message: "Registro no encontrado" });
        return;
      }
      await procedureCitaService.delete(id);
      res.status(200).json({ success: true, message: "Eliminado exitosamente" });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

export const procedureCitaController = new ProcedureCitaController();
