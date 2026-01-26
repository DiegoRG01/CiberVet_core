import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { validateRequest } from "../middlewares/validateRequest";
import { authenticate } from "../middlewares/auth.middleware";
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
} from "../models/schemas/auth.schema";

const router: Router = Router();

/**
 * @route   POST /api/v1/auth/register
 * @desc    Registrar un nuevo usuario
 * @access  Public
 */
router.post(
  "/register",
  validateRequest(registerSchema),
  authController.register.bind(authController),
);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Iniciar sesión
 * @access  Public
 */
router.post(
  "/login",
  validateRequest(loginSchema),
  authController.login.bind(authController),
);

/**
 * @route   POST /api/v1/auth/refresh
 * @desc    Refrescar token de acceso
 * @access  Public
 */
router.post(
  "/refresh",
  validateRequest(refreshTokenSchema),
  authController.refreshToken.bind(authController),
);

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Cerrar sesión
 * @access  Private
 */
router.post(
  "/logout",
  authenticate,
  authController.logout.bind(authController),
);

/**
 * @route   GET /api/v1/auth/me
 * @desc    Obtener usuario actual
 * @access  Private
 */
router.get(
  "/me",
  authenticate,
  authController.getCurrentUser.bind(authController),
);

export default router;
