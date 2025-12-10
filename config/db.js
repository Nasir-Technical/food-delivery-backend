// import mongoose from "mongoose";

// let isConnected = false;

// export const connectDB = async () => {
//   if (isConnected) return;

//   try {
//     await mongoose.connect(process.env.MONGO_URI); // <-- confirm this name
//     isConnected = true;
//     console.log("✅ MongoDB connected");
//   } catch (err) {
//     console.error("❌ MongoDB error:", err.message);
//     throw err;
//   }
// };

import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // <-- yeh line add karo

const MONGO_URL = process.env.MONGODB_URL;

let isConnected = false;

export default async function connectDB() {
  if (isConnected) {
    console.log("MongoDB already connected.");
    return;
  }

  try {
    const db = await mongoose.connect(MONGO_URL, {
      serverSelectionTimeoutMS: 5000,
    });

    isConnected = db.connections[0].readyState === 1;
    console.log("MongoDB connected successfully (serverless)");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}