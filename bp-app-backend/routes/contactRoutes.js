import express from "express";
import authMiddleware from "../middleware/auth.js";
import { submitContact } from "../controllers/authController.js";

const router = express.Router();

router.post("/contact/submit", authMiddleware, submitContact);

export default router;