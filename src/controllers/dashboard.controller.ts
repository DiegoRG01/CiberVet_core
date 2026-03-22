import { Request, Response } from "express";
import { dashboardService } from "../services/dashboard.service";

export class DashboardController {
  async getStats(_req: Request, res: Response) {
    try {
      const stats = await dashboardService.getStats();

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error: any) {
      console.error("Error en DashboardController.getStats:", error);
      res.status(500).json({
        success: false,
        error: "Error del servidor",
        message: error.message || "Error al obtener estadísticas del dashboard",
      });
    }
  }
}

export const dashboardController = new DashboardController();
