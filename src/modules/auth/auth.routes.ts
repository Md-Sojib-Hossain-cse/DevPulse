import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router();

router.use("/register", authController.registerUser);

export const authRoutes = router;
