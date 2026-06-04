import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dbConnect from "./config/dbConnect.js";
import authRoutes from "./routes/authRoutes.js";
import readingRoutes from "./routes/readingRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import healthRoutes from "./routes/healthRoutes.js";

dotenv.config();
dbConnect();

const app = express();

// CORS Configuration
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", authRoutes);
app.use("/api", readingRoutes);
app.use("/api", contactRoutes);
app.use("/api", healthRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});