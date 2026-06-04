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

// CORS Configuration
app.use(cors());
app.use(express.json());

// API Routes (pehle rakhna important hai)
app.use("/api", authRoutes);
app.use("/api", readingRoutes);
app.use("/api", contactRoutes);
app.use("/api", healthRoutes);

// ✅ Serve React Frontend (YE NAYA CODE HAI - API routes ke BAAD)
app.use(express.static(path.join(__dirname, '../bp-app/build')));

// ✅ All non-API routes go to React (YE BHI NAYA HAI)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../bp-app/build', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});