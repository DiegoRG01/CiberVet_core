import { Router } from "express";
import { veterinarianController } from "../controllers/veterinarian.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";

const router: Router = Router();

/**
 * @route   GET /api/veterinarians
 * @desc    Obtener todos los veterinarios activos
 * @access  Private (operator, admin)
 */
router.get(
  "/",
  authenticate,
  authorize("operator", "admin"),
  veterinarianController.getAll.bind(veterinarianController),
);

/**
 * @route   GET /api/veterinarians/:id
 * @desc    Obtener un veterinario por ID
 * @access  Private (operator, admin)
 */
router.get(
  "/:id",
  authenticate,
  authorize("operator", "admin"),
  veterinarianController.getById.bind(veterinarianController),
);

export default router;
