import { Router } from "express";
import { breedController } from "../controllers/breed.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { validateRequest } from "../middlewares/validateRequest";
import {
  createBreedSchema,
  updateBreedSchema,
} from "../models/schemas/species.schema";

const router: Router = Router();

/**
 * @route   GET /api/breeds
 * @desc    Obtener todas las razas
 * @access  Private
 * @query   includeInactive - Incluir razas inactivas (solo admin)
 */
router.get(
  "/",
  authenticate,
  breedController.getAllBreeds.bind(breedController),
);

/**
 * @route   GET /api/breeds/:id
 * @desc    Obtener una raza por ID
 * @access  Private
 */
router.get(
  "/:id",
  authenticate,
  breedController.getBreedById.bind(breedController),
);

/**
 * @route   POST /api/breeds
 * @desc    Crear una nueva raza
 * @access  Private (admin)
 */
router.post(
  "/",
  authenticate,
  authorize("admin"),
  validateRequest(createBreedSchema),
  breedController.createBreed.bind(breedController),
);

/**
 * @route   PUT /api/breeds/:id
 * @desc    Actualizar una raza
 * @access  Private (admin)
 */
router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  validateRequest(updateBreedSchema),
  breedController.updateBreed.bind(breedController),
);

/**
 * @route   DELETE /api/breeds/:id
 * @desc    Eliminar (desactivar) una raza
 * @access  Private (admin)
 */
router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  breedController.deleteBreed.bind(breedController),
);

export default router;
