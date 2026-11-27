import mongoose from "mongoose";

export async function connectDB() {
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/alzehrasilk";
  mongoose.set("strictQuery", true);

  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected for Al-Zehra Silk");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
}