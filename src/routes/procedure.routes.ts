import { Router } from "express";
import { procedureController } from "../controllers/procedure.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { validateRequest } from "../middlewares/validateRequest";
import { createProcedureSchema, updateProcedureSchema } from "../models/schemas/procedure.schema";

const router: Router = Router();

router.get("/", authenticate, procedureController.getAll.bind(procedureController));
router.get("/:id", authenticate, procedureController.getById.bind(procedureController));

router.post(
  "/",
  authenticate,
  authorize("admin"),
  validateRequest(createProcedureSchema),
  procedureController.create.bind(procedureController),
);

router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  validateRequest(updateProcedureSchema),
  procedureController.update.bind(procedureController),
);

router.patch(
  "/:id/toggle-active",
  authenticate,
  authorize("admin"),
  procedureController.toggleActive.bind(procedureController),
);

export default router;
