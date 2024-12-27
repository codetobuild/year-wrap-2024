import dotenv from "dotenv";
import { createApp } from "./app";
import { AppServer } from "./server";
import { logger } from "./config/logger";

// Load environment variables
dotenv.config();

async function bootstrap() {
  try {
    const app = createApp();
    const server = new AppServer(app);
    await server.start();
  } catch (error) {
    logger.error("Failed to bootstrap application:", error);
    process.exit(1);
  }
}

bootstrap();
