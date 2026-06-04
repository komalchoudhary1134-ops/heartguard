import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String },
  message: { type: String, required: true },
  userID: { type: String },
  createdAt: { type: Date, default: Date.now },
  status: { type: String, default: "unread" }
});

export default mongoose.model("Contact", contactSchema);