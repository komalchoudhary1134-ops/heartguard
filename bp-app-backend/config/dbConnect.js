import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from 'dns';

dns.setServers(['1.1.1.1','8.8.8.8'])

dotenv.config();

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.log("❌ Database connection error:", error);
  }
};

export default dbConnect;