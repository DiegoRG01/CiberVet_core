import { Router } from "express";
import { ownerController } from "../controllers/owner.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { validateRequest } from "../middlewares/validateRequest";
import { createOwnerSchema, updateOwnerSchema } from "../models/schemas/owner.schema";

const router: Router = Router();

/**
 * @route   GET /api/owners/me
 * @desc    Obtener el perfil del propietario logueado
 * @access  Private (propietario)
 */
router.get(
  "/me",
  authenticate,
  authorize("propietario"),
  ownerController.getMyOwnerProfile.bind(ownerController),
);

/**
 * @route   GET /api/owners
 * @desc    Obtener todos los propietarios
 * @access  Private (admin, operador)
 */
router.get(
  "/",
  authenticate,
  authorize("admin", "operador"),
  ownerController.getAllOwners.bind(ownerController),
);

/**
 * @route   GET /api/owners/:id
 * @desc    Obtener un propietario por ID
 * @access  Private (admin, operador)
 */
router.get(
  "/:id",
  authenticate,
  authorize("admin", "operador"),
  ownerController.getOwnerById.bind(ownerController),
);

/**
 * @route   POST /api/owners
 * @desc    Crear un nuevo propietario
 * @access  Private (admin, operador)
 */
router.post(
  "/",
  authenticate,
  authorize("admin", "operador"),
  validateRequest(createOwnerSchema),
  ownerController.createOwner.bind(ownerController),
);

/**
 * @route   PUT /api/owners/:id
 * @desc    Actualizar un propietario (admin puede cambiar usuarioId; propietario solo edita el suyo)
 * @access  Private (admin, operador, propietario)
 */
router.put(
  "/:id",
  authenticate,
  authorize("admin", "operador", "propietario"),
  validateRequest(updateOwnerSchema),
  ownerController.updateOwner.bind(ownerController),
);

/**
 * @route   DELETE /api/owners/:id
 * @desc    Desactivar un propietario (desactiva su usuario)
 * @access  Private (admin)
 */
router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  ownerController.deactivateOwner.bind(ownerController),
);

export default router;
