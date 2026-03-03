import { Router } from "express";
import { getAllPatients, createPatient } from "../controllers/patient.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", authenticate, getAllPatients);
router.post("/", authenticate, createPatient);

export default router;