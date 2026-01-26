import { Router } from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";

const router: Router = Router();

// Rutas de autenticación
router.use("/auth", authRoutes);

// Rutas de usuarios
router.use("/users", userRoutes);

// Aquí puedes agregar más rutas en el futuro
// router.use('/appointments', appointmentRoutes);
// router.use('/patients', patientRoutes);
// router.use('/owners', ownerRoutes);

export default router;
