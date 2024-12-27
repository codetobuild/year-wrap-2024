import { Request, Response, NextFunction } from "express";
import { BaseController } from "./baseController";
import UserModel from "../models/User";

export class UserController extends BaseController {
  async getCurrentUser(req: Request, res: Response, next: NextFunction) {
    await this.handleRequest(req, res, next, async () => {
      const user = await UserModel.findOne({ sessionId: req.sessionId });
      if (!user) this.handleError("User not found");
      return user;
    });
  }

  async updateUser(req: Request, res: Response, next: NextFunction) {
    await this.handleRequest(req, res, next, async () => {
      const user = await UserModel.findOneAndUpdate(
        { sessionId: req.sessionId },
        req.body,
        { new: true }
      );
      if (!user) this.handleError("User not found");
      return user;
    });
  }

  async getUserStats(req: Request, res: Response, next: NextFunction) {
    await this.handleRequest(req, res, next, async () => {
      const stats = await UserModel.aggregate([
        { $match: { sessionId: req.sessionId } },
        // Add your aggregation pipeline here
      ]);
      return stats;
    });
  }
}
