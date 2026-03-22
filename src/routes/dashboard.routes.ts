import { Router } from "express";
import { dashboardController } from "../controllers/dashboard.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";

const router: Router = Router();

/**
 * @route   GET /api/v1/dashboard/stats
 * @desc    Obtener estadísticas del dashboard
 * @access  Private (operator, admin)
 */
router.get(
  "/stats",
  authenticate,
  authorize("admin"),
  dashboardController.getStats.bind(dashboardController),
);

export default router;
