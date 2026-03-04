const mongoose = require("mongoose");

async function connectDB() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error("MONGO_URI is not defined in environment variables");
  }

  try {
    await mongoose.connect(uri);
    console.log(`MongoDB connected: ${mongoose.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    console.error("Check: 1) Your IP is whitelisted in Atlas  2) Credentials are correct  3) You have internet access");
    process.exit(1);
  }
}

module.exports = connectDB;
