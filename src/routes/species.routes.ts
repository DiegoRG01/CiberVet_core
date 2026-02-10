import { Router } from "express";
import { speciesController } from "../controllers/species.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { validateRequest } from "../middlewares/validateRequest";
import {
  createSpeciesSchema,
  updateSpeciesSchema,
} from "../models/schemas/species.schema";

const router: Router = Router();

/**
 * @route   GET /api/species
 * @desc    Obtener todas las especies
 * @access  Public (puede ser usado por todos los usuarios autenticados)
 * @query   includeInactive - Incluir especies inactivas (solo admin)
 */
router.get(
  "/",
  authenticate,
  speciesController.getAllSpecies.bind(speciesController),
);

/**
 * @route   GET /api/species/:id
 * @desc    Obtener una especie por ID
 * @access  Private
 */
router.get(
  "/:id",
  authenticate,
  speciesController.getSpeciesById.bind(speciesController),
);

/**
 * @route   GET /api/species/:id/breeds
 * @desc    Obtener razas de una especie
 * @access  Private
 * @query   includeInactive - Incluir razas inactivas (solo admin)
 */
router.get(
  "/:id/breeds",
  authenticate,
  speciesController.getBreedsBySpecies.bind(speciesController),
);

/**
 * @route   POST /api/species
 * @desc    Crear una nueva especie
 * @access  Private (admin)
 */
router.post(
  "/",
  authenticate,
  authorize("admin"),
  validateRequest(createSpeciesSchema),
  speciesController.createSpecies.bind(speciesController),
);

/**
 * @route   PUT /api/species/:id
 * @desc    Actualizar una especie
 * @access  Private (admin)
 */
router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  validateRequest(updateSpeciesSchema),
  speciesController.updateSpecies.bind(speciesController),
);

/**
 * @route   DELETE /api/species/:id
 * @desc    Eliminar (desactivar) una especie
 * @access  Private (admin)
 */
router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  speciesController.deleteSpecies.bind(speciesController),
);

export default router;
