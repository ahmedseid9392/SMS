import mongoose from "mongoose";
import AcademicYear from "../models/AcademicYear.model.js";
import dotenv from 'dotenv';

dotenv.config();

async function createAcademicYears() {
  try {
    await mongoose.connect(process.env.MONGO_URI );
    console.log("Connected to MongoDB");
    
    await AcademicYear.createDefaultYears();
    console.log("Default academic years created successfully");
    
    const years = await AcademicYear.find();
    console.log("Academic years:", years);
    
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

createAcademicYears();