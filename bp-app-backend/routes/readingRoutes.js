import express from "express";
import authMiddleware from "../middleware/auth.js";
import { addReading, getReadings, deleteReading, getStats } from "../controllers/authController.js";



const router = express.Router();

router.post("/readings/add", authMiddleware, addReading);
router.get("/readings", authMiddleware, getReadings);
router.delete("/readings/:id", authMiddleware, deleteReading);
router.get("/readings/stats", authMiddleware, getStats);

export default router;