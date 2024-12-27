import mongoose from "mongoose";
import { logger } from "./logger";

export async function connectDB(): Promise<void> {
  const MONGODB_URI = process.env.MONGODB_URI!;

  try {
    const options = {
      autoIndex: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    await mongoose.connect(MONGODB_URI, options);
    logger.info("Successfully connected to MongoDB.");
  } catch (error) {
    logger.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }

  mongoose.connection.on("error", (error) => {
    logger.error("MongoDB connection error:", error);
  });

  mongoose.connection.on("disconnected", () => {
    logger.warn("MongoDB disconnected");
  });
}

export async function disconnectDB(): Promise<void> {
  try {
    await mongoose.connection.close();
    logger.info("MongoDB connection closed.");
  } catch (error) {
    logger.error("Error closing MongoDB connection:", error);
    process.exit(1);
  }
}
