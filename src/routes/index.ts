import { Router } from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import speciesRoutes from "./species.routes";
import breedRoutes from "./breed.routes";
import appointmentRoutes from "./appointment.routes";
import patientRoutes from "./patient.routes";
import ownerRoutes from "./owner.routes";
import procedureRoutes from "./procedure.routes";
import procedureCitaRoutes from "./procedure-cita.routes";
import dashboardRoutes from "./dashboard.routes";
import veterinarianRoutes from "./veterinarian.routes";

const router: Router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/owners", ownerRoutes);
router.use("/species", speciesRoutes);
router.use("/breeds", breedRoutes);
router.use("/appointments", appointmentRoutes);
router.use("/patients", patientRoutes);
router.use("/procedures", procedureRoutes);
router.use("/procedure-citas", procedureCitaRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/veterinarians", veterinarianRoutes);

export default router;

