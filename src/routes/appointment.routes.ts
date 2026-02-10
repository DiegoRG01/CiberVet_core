import { Router } from "express";
import { appointmentController } from "../controllers/appointment.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { validateRequest } from "../middlewares/validateRequest";
import {
  createAppointmentSchema,
  updateAppointmentSchema,
} from "../models/schemas/appointment.schema";

const router: Router = Router();

/**
 * @route   GET /api/appointments
 * @desc    Obtener todas las citas
 * @access  Private
 * @query   status - Filtrar por estado de cita (opcional)
 */
router.get(
  "/",
  authenticate,
  appointmentController.getAllAppointments.bind(appointmentController)
);

/**
 * @route   GET /api/appointments/:id
 * @desc    Obtener una cita por ID
 * @access  Private
 */
router.get(
  "/:id",
  authenticate,
  appointmentController.getAppointmentById.bind(appointmentController)
);

/**
 * @route   POST /api/appointments
 * @desc    Crear una nueva cita
 * @access  Private (operator, admin)
 */
router.post(
  "/",
  authenticate,
  authorize("operator", "admin"),
  validateRequest(createAppointmentSchema),
  appointmentController.createAppointment.bind(appointmentController)
);

/**
 * @route   PUT /api/appointments/:id
 * @desc    Actualizar una cita
 * @access  Private (operator, admin)
 */
router.put(
  "/:id",
  authenticate,
  authorize("operator", "admin"),
  validateRequest(updateAppointmentSchema),
  appointmentController.updateAppointment.bind(appointmentController)
);

/**
 * @route   POST /api/appointments/:id/cancel
 * @desc    Cancelar una cita
 * @access  Private (operator, admin)
 */
router.post(
  "/:id/cancel",
  authenticate,
  authorize("operator", "admin"),
  appointmentController.cancelAppointment.bind(appointmentController)
);

export default router;
