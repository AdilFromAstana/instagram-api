const mongoose = require("mongoose");
const dotenv = require("dotenv");
const os = require("os");

dotenv.config();

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in the environment variables");
    }

    const networkInterfaces = os.networkInterfaces();
    const ipAddresses = Object.values(networkInterfaces)
      .flat()
      .filter((details) => details.family === "IPv4" && !details.internal)
      .map((details) => details.address);

    console.log("Attempting to connect from the following IPs:", ipAddresses);

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
