import { Server } from "http";
import { Express } from "express";
import { logger } from "./config/logger";
import { connectDB, disconnectDB } from "./config/database";

export class AppServer {
  private server: Server | null = null;

  constructor(private app: Express) {}

  async start(): Promise<void> {
    try {
      const port = process.env.PORT || 3000;

      // Connect to Database
      await connectDB();

      // Start Server
      this.server = this.app.listen(port, () => {
        logger.info(`Server is running on port ${port}`);
      });

      // Handle server errors
      this.server.on("error", (error) => {
        logger.error("Server error:", error);
        this.gracefulShutdown();
      });

      this.setupGracefulShutdown();
    } catch (error) {
      logger.error("Failed to start server:", error);
      process.exit(1);
    }
  }

  private setupGracefulShutdown(): void {
    const signals = ["SIGTERM", "SIGINT"];

    signals.forEach((signal) => {
      process.on(signal, async () => {
        logger.info(`${signal} received. Starting graceful shutdown...`);
        await this.gracefulShutdown();
      });
    });

    process.on("uncaughtException", async (error) => {
      logger.error("Uncaught Exception:", error);
      await this.gracefulShutdown();
    });

    process.on("unhandledRejection", async (reason) => {
      logger.error("Unhandled Rejection:", reason);
      await this.gracefulShutdown();
    });
  }

  private async gracefulShutdown(): Promise<void> {
    try {
      logger.info("Starting graceful shutdown...");

      if (this.server) {
        await new Promise<void>((resolve) => {
          this.server?.close(() => {
            logger.info("Server closed");
            resolve();
          });
        });
      }

      await disconnectDB();

      logger.info("Graceful shutdown completed");
      process.exit(0);
    } catch (error) {
      logger.error("Error during graceful shutdown:", error);
      process.exit(1);
    }
  }
}
