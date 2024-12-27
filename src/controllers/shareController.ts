// src/controllers/shareController.ts
import { Request, Response } from "express";
import { AppError } from "../types/error";
import ShareModel from "../models/Share";

export class ShareController {
  async createShare(req: Request, res: Response) {
    const share = await ShareModel.create({
      ...req.body,
      sessionId: req.sessionId,
    });
    res.status(201).json({ status: "success", data: share });
  }

  async getShareByCode(req: Request, res: Response) {
    const share = await ShareModel.findOne({
      shareCode: req.params.shareCode,
    }).populate("submissionId");

    if (!share) {
      throw new AppError(404, "fail", "Share not found");
    }

    res.json({ status: "success", data: share });
  }

  async recordView(req: Request, res: Response) {
    const share = await ShareModel.findOneAndUpdate(
      { shareCode: req.params.shareCode },
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!share) {
      throw new AppError(404, "fail", "Share not found");
    }

    res.json({ status: "success", data: share });
  }
}
