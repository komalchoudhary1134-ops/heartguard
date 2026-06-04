import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Reading from "../models/Reading.js";
import Contact from "../models/Contact.js";

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Get BP status
const getBPStatus = (systolic, diastolic) => {
  if (systolic < 120 && diastolic < 80) return "Normal";
  if (systolic >= 120 && systolic <= 129 && diastolic < 80) return "Elevated";
  if ((systolic >= 130 && systolic <= 139) || (diastolic >= 80 && diastolic <= 89)) return "High Stage 1";
  if (systolic >= 140 || diastolic >= 90) return "High Stage 2";
  return "Normal";
};

// ============ AUTH ============
export const signup = async (req, res) => {
  try {
    const { name, email, phone, dob, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const user = new User({ name, email, phone, dob, password });
    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ============ READINGS ============

export const addReading = async (req, res) => {
  try {
    const { systolic, diastolic, heartRate, notes } = req.body;
    const status = getBPStatus(systolic, diastolic);
    
    console.log("📝 Adding reading for user:", req.userId);
    
    const newReading = new Reading({
      userId: req.userId,
      systolic,
      diastolic,
      heartRate: heartRate || null,
      notes: notes || "",
      status,
      date: new Date()
    });
    
    await newReading.save();
    
    console.log("✅ Reading added. ID:", newReading._id);
    
    res.json({ 
      success: true, 
      message: "Reading added successfully",
      reading: newReading
    });
  } catch (error) {
    console.error("❌ Add reading error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getReadings = async (req, res) => {
  try {
    const readings = await Reading.find({ userId: req.userId }).sort({ date: -1 });
    console.log("📚 Total readings found:", readings.length);
    res.json(readings);
  } catch (error) {
    console.error("❌ Get readings error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteReading = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Reading.findOneAndDelete({ _id: id, userId: req.userId });
    
    if (!result) {
      return res.status(404).json({ success: false, message: "Reading not found" });
    }
    
    console.log("🗑️ Reading deleted:", id);
    res.json({ success: true, message: "Reading deleted" });
  } catch (error) {
    console.error("❌ Delete reading error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStats = async (req, res) => {
  try {
    const readings = await Reading.find({ userId: req.userId });
    
    if (readings.length === 0) {
      return res.json({ avgSys: 0, avgDia: 0, total: 0, latest: null });
    }

    const avgSys = readings.reduce((sum, r) => sum + r.systolic, 0) / readings.length;
    const avgDia = readings.reduce((sum, r) => sum + r.diastolic, 0) / readings.length;

    res.json({
      avgSys: Math.round(avgSys),
      avgDia: Math.round(avgDia),
      total: readings.length,
      latest: readings[0] || null
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ============ HEALTH DATA CONTROLLERS ============

export const getHealthData = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    res.json(user.healthData || { 
      bmi: {}, 
      waterIntake: { count: 0 }, 
      weeklyChallenge: { completedDays: [] } 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBMI = async (req, res) => {
  try {
    const { height, weight, value, category } = req.body;
    const user = await User.findById(req.userId);
    if (!user.healthData) user.healthData = {};
    user.healthData.bmi = { height, weight, value, category };
    await user.save();
    console.log("✅ BMI updated for user:", req.userId);
    res.json({ success: true, message: "BMI updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateWaterIntake = async (req, res) => {
  try {
    const { count } = req.body;
    const user = await User.findById(req.userId);
    if (!user.healthData) user.healthData = {};
    if (!user.healthData.waterIntake) user.healthData.waterIntake = { count: 0 };
    user.healthData.waterIntake.count = count;
    await user.save();
    console.log("💧 Water intake updated:", count);
    res.json({ success: true, message: "Water intake updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateChallenge = async (req, res) => {
  try {
    const { completedDays } = req.body;
    const user = await User.findById(req.userId);
    if (!user.healthData) user.healthData = {};
    if (!user.healthData.weeklyChallenge) user.healthData.weeklyChallenge = { completedDays: [] };
    user.healthData.weeklyChallenge.completedDays = completedDays;
    await user.save();
    console.log("🏆 Challenge updated:", completedDays);
    res.json({ success: true, message: "Challenge updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ============ CONTACT ============

export const submitContact = async (req, res) => {
  try {
    const { name, email, subject, message, userId } = req.body;
    
    const contact = new Contact({
      name,
      email,
      subject,
      message,
      userID: userId || null
    });
    
    await contact.save();
    console.log("📧 Contact saved:", email);
    
    res.json({ success: true, message: "Message sent successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};