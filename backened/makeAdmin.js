import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/userModel.js";

dotenv.config();

const makeAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Make all users admin for development/testing purposes
    // Or specifically the user named "Soni"
    const result = await User.updateMany({}, { $set: { isAdmin: true } });
    
    console.log(`✅ Updated ${result.modifiedCount} users to Admin!`);

    await mongoose.disconnect();
    console.log("✅ Done! You are now an Admin.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Failed to update users:", err.message);
    process.exit(1);
  }
};

makeAdmin();
