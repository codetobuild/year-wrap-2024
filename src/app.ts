import express, { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import routes from "./routes";
import { errorHandler, requestLogger, sessionHandler } from "./middlewares";

export function createApp(): Express {
  const app = express();

  // Security Middleware
  app.use(helmet());
  app.use(cors());

  // Rate Limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again later.",
  });

  // Body Parsing
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Logging
  app.use(morgan("dev"));
  app.use(requestLogger);

  // Session Handling
  app.use(sessionHandler);

  // Routes
  app.use("/api", limiter);

  app.use("/api", routes);

  // Error Handling
  app.use(errorHandler);

  return app;
}
