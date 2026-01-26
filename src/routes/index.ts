import { Router } from "express";
import authRoutes from "./auth.routes";

const router = Router();

// Rutas de autenticación
router.use("/auth", authRoutes);

// Aquí puedes agregar más rutas en el futuro
// router.use('/appointments', appointmentRoutes);
// router.use('/patients', patientRoutes);
// router.use('/owners', ownerRoutes);

export default router;
