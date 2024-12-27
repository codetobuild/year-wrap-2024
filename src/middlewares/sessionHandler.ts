import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import { logger } from "../config/logger";
import UserModel from "../models/User";

export const sessionHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Check for existing session ID in headers
    let sessionId = req.headers["x-session-id"] as string;

    // If no session ID exists, create a new one
    if (!sessionId) {
      sessionId = uuidv4();
      req.headers["x-session-id"] = sessionId;

      // Create new user session in database
      const userAgent = req.headers["user-agent"] || "";
      const deviceType = getDeviceType(userAgent);

      await UserModel.create({
        sessionId,
        device: {
          type: deviceType,
          browser: getBrowser(userAgent),
          userAgent,
        },
        country: req.headers["cf-ipcountry"] || req.ip, // Fallback to IP if Cloudflare header not present
        lastActive: new Date(),
      });

      logger.info(`New session created: ${sessionId}`);
    } else {
      // Update last active timestamp for existing session
      await UserModel.findOneAndUpdate(
        { sessionId },
        {
          lastActive: new Date(),
          "device.userAgent": req.headers["user-agent"],
        }
      );
    }

    // Attach session ID to request object
    req.sessionId = sessionId;
    next();
  } catch (error) {
    logger.error("Session handling error:", error);
    next(error);
  }
};

// Helper functions for sessionHandler
function getDeviceType(userAgent: string): string {
  const ua = userAgent.toLowerCase();
  if (
    ua.includes("mobile") ||
    ua.includes("android") ||
    ua.includes("iphone")
  ) {
    return "mobile";
  }
  if (ua.includes("tablet") || ua.includes("ipad")) {
    return "tablet";
  }
  return "desktop";
}

function getBrowser(userAgent: string): string {
  const ua = userAgent.toLowerCase();

  if (ua.includes("firefox")) {
    return "Firefox";
  }
  if (ua.includes("chrome")) {
    return "Chrome";
  }
  if (ua.includes("safari")) {
    return "Safari";
  }
  if (ua.includes("edge")) {
    return "Edge";
  }
  if (ua.includes("opera")) {
    return "Opera";
  }

  return "Other";
}
