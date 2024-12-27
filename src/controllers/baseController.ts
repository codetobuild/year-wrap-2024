import { Request, Response, NextFunction } from "express";
import { AppError } from "../types/error";

export class BaseController {
  protected async handleRequest(
    req: Request,
    res: Response,
    next: NextFunction,
    handler: () => Promise<any>
  ) {
    try {
      const result = await handler();
      res.json({
        status: "success",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  protected handleError(message: string, statusCode: number = 404) {
    throw new AppError(statusCode, "error", message);
  }
}
