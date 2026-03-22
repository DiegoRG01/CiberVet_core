import { Request, Response } from "express";
import { procedureService } from "../services/procedure.service";

export class ProcedureController {
  async getAll(req: Request, res: Response) {
    try {
      const includeInactive = req.query.includeInactive === "true";
      const procedures = await procedureService.getAllProcedures(includeInactive);
      res.status(200).json({ success: true, data: procedures });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const procedure = await procedureService.getProcedureById(id);
      if (!procedure) {
        res.status(404).json({ success: false, message: "Procedimiento no encontrado" });
        return;
      }
      res.status(200).json({ success: true, data: procedure });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const procedure = await procedureService.createProcedure(req.body);
      res.status(201).json({ success: true, data: procedure });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const existing = await procedureService.getProcedureById(id);
      if (!existing) {
        res.status(404).json({ success: false, message: "Procedimiento no encontrado" });
        return;
      }
      const procedure = await procedureService.updateProcedure(id, req.body);
      res.status(200).json({ success: true, data: procedure });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async toggleActive(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const existing = await procedureService.getProcedureById(id);
      if (!existing) {
        res.status(404).json({ success: false, message: "Procedimiento no encontrado" });
        return;
      }
      const procedure = await procedureService.toggleActive(id, !existing.estaActivo);
      res.status(200).json({ success: true, data: procedure });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

export const procedureController = new ProcedureController();
