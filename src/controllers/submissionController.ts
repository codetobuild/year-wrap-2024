import { Request, Response } from "express";
import SubmissionModel from "../models/Submission";
import { AppError } from "../types";
import { generateShareCode } from "../utils";

export class SubmissionController {
  async getSubmissions(req: Request, res: Response) {
    const submissions = await SubmissionModel.find({ sessionId: req.sessionId })
      .populate("selectedEvents.eventId")
      .populate("templateId");

    res.json({ success: true, data: submissions });
  }

  async createSubmission(req: Request, res: Response) {
    const shareCode = await generateShareCode();
    const submission = await SubmissionModel.create({
      ...req.body,
      sessionId: req.sessionId,
      shareCode,
    });

    res.status(201).json({ success: true, data: submission });
  }

  async getSubmission(req: Request, res: Response) {
    const submission = await SubmissionModel.findOne({
      _id: req.params.id,
      sessionId: req.sessionId,
    })
      .populate("selectedEvents.eventId")
      .populate("templateId");

    if (!submission) {
      throw new AppError(404, "fail", "Submission not found");
    }

    res.json({ success: true, data: submission });
  }

  async updateSubmission(req: Request, res: Response) {
    const submission = await SubmissionModel.findOneAndUpdate(
      { _id: req.params.id, sessionId: req.sessionId },
      req.body,
      { new: true }
    );

    if (!submission) {
      throw new AppError(404, "fail", "Submission not found");
    }

    res.json({ success: true, data: submission });
  }

  async deleteSubmission(req: Request, res: Response) {
    const submission = await SubmissionModel.findOneAndDelete({
      _id: req.params.id,
      sessionId: req.sessionId,
    });

    if (!submission) {
      throw new AppError(404, "fail", "Submission not found");
    }

    res.json({
      success: true,
      message: "Submission deleted successfully",
    });
  }

  async getSubmissionByCode(req: Request, res: Response) {
    const submission = await SubmissionModel.findOne({
      shareCode: req.params.shareCode,
    })
      .populate("selectedEvents.eventId")
      .populate("templateId");

    if (!submission) {
      throw new AppError(404, "fail", "Submission not found");
    }

    res.json({ success: true, data: submission });
  }
}
