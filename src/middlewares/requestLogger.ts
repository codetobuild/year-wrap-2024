import { Request, Response, NextFunction } from "express";
import { logger } from "../config/logger";

interface RequestWithStartTime extends Request {
  startTime?: number;
}

export const requestLogger = (
  req: RequestWithStartTime,
  res: Response,
  next: NextFunction
) => {
  // Add timestamp when request starts
  req.startTime = Date.now();

  // Log request details
  logger.info(
    `
    ${req.method} ${req.url}
    Headers: ${JSON.stringify(req.headers)}
    Query: ${JSON.stringify(req.query)}
    Body: ${JSON.stringify(req.body)}
  `.trim()
  );

  // Log response details when request completes
  res.on("finish", () => {
    const duration = Date.now() - (req.startTime || 0);
    logger.info(
      `
      Response Status: ${res.statusCode}
      Duration: ${duration}ms
    `.trim()
    );
  });

  next();
};
