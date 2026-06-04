import mongoose from "mongoose";

const readingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  systolic: { type: Number, required: true },
  diastolic: { type: Number, required: true },
  heartRate: { type: Number, default: null },
  notes: { type: String, default: "" },
  status: { type: String, default: "Normal" },
  date: { type: Date, default: Date.now }
});

export default mongoose.model("Reading", readingSchema);