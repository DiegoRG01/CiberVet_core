import { Router } from "express";
import { patientController } from "../controllers/patient.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { validateRequest } from "../middlewares/validateRequest";
import {
  createPatientSchema,
  updatePatientSchema,
} from "../models/schemas/patient.schema";

const router: Router = Router();

/**
 * @route   GET /api/v1/patients
 * @desc    Obtener pacientes (admin/operador: todos | propietario: solo los suyos)
 * @access  Private
 */
router.get(
  "/",
  authenticate,
  patientController.getAllPatients.bind(patientController),
);

/**
 * @route   GET /api/v1/patients/:id
 * @desc    Obtener un paciente por ID con citas, procedimientos e historial
 * @access  Private (propietarios solo pueden ver los suyos)
 */
router.get(
  "/:id",
  authenticate,
  patientController.getPatientById.bind(patientController),
);

/**
 * @route   POST /api/v1/patients
 * @desc    Crear un nuevo paciente
 * @access  Private (admin, operador, propietario)
 */
router.post(
  "/",
  authenticate,
  authorize("admin", "operador", "propietario"),
  validateRequest(createPatientSchema),
  patientController.createPatient.bind(patientController),
);

/**
 * @route   PUT /api/v1/patients/:id
 * @desc    Actualizar un paciente
 * @access  Private (admin, operador, propietario — propietarios solo los suyos)
 */
router.put(
  "/:id",
  authenticate,
  authorize("admin", "operador", "propietario"),
  validateRequest(updatePatientSchema),
  patientController.updatePatient.bind(patientController),
);

/**
 * @route   DELETE /api/v1/patients/:id
 * @desc    Desactivar un paciente (soft delete)
 * @access  Private (admin, operador)
 */
router.delete(
  "/:id",
  authenticate,
  authorize("admin", "operador"),
  patientController.deactivatePatient.bind(patientController),
);

export default router;
