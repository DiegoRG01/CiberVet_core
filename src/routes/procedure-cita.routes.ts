import { Router } from "express";
import { procedureCitaController } from "../controllers/procedure-cita.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { validateRequest } from "../middlewares/validateRequest";
import { createProcedureCitaSchema } from "../models/schemas/procedure-cita.schema";

const router: Router = Router();

// GET /api/v1/procedure-citas/by-appointment/:citaId
router.get(
  "/by-appointment/:citaId",
  authenticate,
  procedureCitaController.getByAppointment.bind(procedureCitaController),
);

// POST /api/v1/procedure-citas
router.post(
  "/",
  authenticate,
  authorize("admin", "operador"),
  validateRequest(createProcedureCitaSchema),
  procedureCitaController.create.bind(procedureCitaController),
);

// DELETE /api/v1/procedure-citas/:id
router.delete(
  "/:id",
  authenticate,
  authorize("admin", "operador"),
  procedureCitaController.delete.bind(procedureCitaController),
);

export default router;
