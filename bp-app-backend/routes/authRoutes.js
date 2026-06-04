import express from "express";
import { signup, login } from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);   // ✅ Change to /signup
router.post("/login", login);     // ✅ Change to /login

export default router;