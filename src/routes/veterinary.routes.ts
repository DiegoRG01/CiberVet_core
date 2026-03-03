import { Router } from "express";
import { getAllVeterinaries } from "../controllers/veterinary.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", authenticate, getAllVeterinaries);

export default router;