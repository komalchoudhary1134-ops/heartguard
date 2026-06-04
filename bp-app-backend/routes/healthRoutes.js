import express from "express";
import authMiddleware from "../middleware/auth.js";
import { 
    getHealthData, 
    updateBMI, 
    updateWaterIntake, 
    updateChallenge 
} from "../controllers/authController.js";

const router = express.Router();

// All health routes require authentication
router.get("/health", authMiddleware, getHealthData);
router.post("/health/bmi", authMiddleware, updateBMI);
router.post("/health/water", authMiddleware, updateWaterIntake);
router.post("/health/challenge", authMiddleware, updateChallenge);

export default router;