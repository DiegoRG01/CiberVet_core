import { Router } from "express";
import { userController } from "../controllers/user.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";

const router: Router = Router();

/**
 * @route   GET /api/users
 * @desc    Obtener todos los usuarios
 * @access  Private (admin, operator)
 */
router.get(
  "/",
  authenticate,
  authorize("admin"),
  userController.getAllUsers.bind(userController),
);

/**
 * @route   GET /api/users/:id
 * @desc    Obtener un usuario por ID
 * @access  Private (admin)
 */
router.get(
  "/:id",
  authenticate,
  authorize("admin"),
  userController.getUserById.bind(userController),
);

/**
 * @route   PUT /api/users/:id
 * @desc    Actualizar un usuario
 * @access  Private (admin)
 */
router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  userController.updateUser.bind(userController),
);

/**
 * @route   DELETE /api/users/:id
 * @desc    Eliminar (desactivar) un usuario
 * @access  Private (admin)
 */
router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  userController.deleteUser.bind(userController),
);

export default router;
