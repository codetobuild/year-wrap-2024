import { Request, Response } from "express";
import UserModel from "../models/User";

export class UserController {
  async getCurrentUser(req: Request, res: Response) {
    const user = await UserModel.findOne({ sessionId: req.sessionId });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.json({ success: true, data: user });
  }

  async updateUser(req: Request, res: Response) {
    const user = await UserModel.findOneAndUpdate(
      { sessionId: req.sessionId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.json({ success: true, data: user });
  }

  async getUserStats(req: Request, res: Response) {
    const stats = await UserModel.aggregate([
      { $match: { sessionId: req.sessionId } },
      {
        $group: {
          _id: null,
          totalSubmissions: { $sum: 1 },
          lastSubmission: { $max: "$createdAt" },
        },
      },
      {
        $project: {
          _id: 0,
          totalSubmissions: 1,
          lastSubmission: 1,
        },
      },
    ]);

    res.json({
      success: true,
      data: stats[0] || {
        totalSubmissions: 0,
        lastSubmission: null,
      },
    });
  }
}
