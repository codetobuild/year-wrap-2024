import { Request, Response, NextFunction } from "express";
import { BaseController } from "./baseController";
import SubmissionModel from "../models/Submission";
import { generateShareCode } from "../utils/codeGenerator";

export class SubmissionController extends BaseController {
  async getSubmissions(req: Request, res: Response, next: NextFunction) {
    await this.handleRequest(req, res, next, async () => {
      return await SubmissionModel.find({ sessionId: req.sessionId })
        .populate("selectedEvents.eventId")
        .populate("templateId");
    });
  }

  async createSubmission(req: Request, res: Response, next: NextFunction) {
    await this.handleRequest(req, res, next, async () => {
      const shareCode = await generateShareCode();
      return await SubmissionModel.create({
        ...req.body,
        sessionId: req.sessionId,
        shareCode,
      });
    });
  }

  async getSubmission(req: Request, res: Response, next: NextFunction) {
    await this.handleRequest(req, res, next, async () => {
      const submission = await SubmissionModel.findOne({
        _id: req.params.id,
        sessionId: req.sessionId,
      })
        .populate("selectedEvents.eventId")
        .populate("templateId");

      if (!submission) this.handleError("Submission not found");
      return submission;
    });
  }

  async updateSubmission(req: Request, res: Response, next: NextFunction) {
    await this.handleRequest(req, res, next, async () => {
      const submission = await SubmissionModel.findOneAndUpdate(
        { _id: req.params.id, sessionId: req.sessionId },
        req.body,
        { new: true }
      );
      if (!submission) this.handleError("Submission not found");
      return submission;
    });
  }

  async deleteSubmission(req: Request, res: Response, next: NextFunction) {
    await this.handleRequest(req, res, next, async () => {
      const submission = await SubmissionModel.findOneAndDelete({
        _id: req.params.id,
        sessionId: req.sessionId,
      });
      if (!submission) this.handleError("Submission not found");
      return { message: "Submission deleted successfully" };
    });
  }

  async getSubmissionByCode(req: Request, res: Response, next: NextFunction) {
    await this.handleRequest(req, res, next, async () => {
      const submission = await SubmissionModel.findOne({
        shareCode: req.params.shareCode,
      })
        .populate("selectedEvents.eventId")
        .populate("templateId");

      if (!submission) this.handleError("Submission not found");
      return submission;
    });
  }
}
