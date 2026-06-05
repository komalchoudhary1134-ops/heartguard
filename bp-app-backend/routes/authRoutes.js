import express from "express";
import { signup, login } from "../controllers/authController.js";

const router = express.Router();

router.post("/auth/signup", signup);   // ✅ Pehle wala
router.post("/auth/login", login);     // ✅ Pehle wala

export default router;