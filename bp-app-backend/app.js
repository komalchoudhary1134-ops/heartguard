import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import dbConnect from "./config/dbConnect.js";
import authRoutes from "./routes/authRoutes.js";
import readingRoutes from "./routes/readingRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import healthRoutes from "./routes/healthRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
dbConnect();

const app = express();

// ✅ UPDATED CORS Configuration - New Vercel Frontend Allow
app.use(cors({
    origin: [
        'https://heartguard-xi.vercel.app',
        'https://heartguard-cq9bpgfvi-komal-s-projects6.vercel.app',
        'https://heartguard.vercel.app',
        'http://localhost:3000'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// API Routes
app.use("/api", authRoutes);
app.use("/api", readingRoutes);
app.use("/api", contactRoutes);
app.use("/api", healthRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});