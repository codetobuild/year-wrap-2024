import express, { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import routes from "./routes";
import path from "path";
import { errorHandler, requestLogger, sessionHandler } from "./middlewares";

export function createApp(): Express {
  const app = express();

  // Security Middleware
  app.use(helmet());
  app.use(
    cors({
      origin: process.env.FRONTEND_URL!, // Your Angular app URL
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // explicitly specify methods
      allowedHeaders: ["Content-Type", "Authorization"],
      exposedHeaders: ["Content-Range", "X-Content-Range"],
      credentials: true,
    })
  );

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

  // Serve static files from 'public' directory
  app.use(
    "/images",
    express.static(path.join(__dirname, "../public/images"), {
      setHeaders: (res, path) => {
        res.set("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
        res.set("Cross-Origin-Resource-Policy", "cross-origin");
      },
    })
  );

  // Routes
  app.use("/api", limiter);

  app.use("/api", routes);

  // Error Handling
  app.use(errorHandler);

  return app;
}
