import { Router } from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import speciesRoutes from "./species.routes";
import breedRoutes from "./breed.routes";

const router: Router = Router();

// Rutas de autenticación
router.use("/auth", authRoutes);

// Rutas de usuarios
router.use("/users", userRoutes);

// Rutas de especies
router.use("/species", speciesRoutes);

// Rutas de razas
router.use("/breeds", breedRoutes);

// Aquí puedes agregar más rutas en el futuro
// router.use('/appointments', appointmentRoutes);
// router.use('/patients', patientRoutes);
// router.use('/owners', ownerRoutes);

export default router;
