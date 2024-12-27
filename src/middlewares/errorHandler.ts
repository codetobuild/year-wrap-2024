import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { logger } from "../config/logger";
import { AppError } from "../types/error";

export const errorHandler: ErrorRequestHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.error("Error 💥:", err);

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
    return;
  }

  // MongoDB Duplicate Key Error
  if (err.name === "MongoServerError" && (err as any).code === 11000) {
    const field = Object.keys((err as any).keyValue)[0];
    res.status(400).json({
      status: "error",
      message: `Duplicate value for ${field}. Please use another value.`,
    });
    return;
  }

  // MongoDB Validation Error
  if (err.name === "ValidationError") {
    res.status(400).json({
      status: "error",
      message: err.message,
    });
    return;
  }

  // Default Error
  res.status(500).json({
    status: "error",
    message: "Something went wrong!",
    ...(process.env.NODE_ENV === "development" && {
      error: err,
      stack: err.stack,
    }),
  });
  return;
};
