import { Request, Response } from "express";
import SubmissionModel from "../models/Submission";
import { AppError, IEvent } from "../types";
import { generateShareCode } from "../utils";
import Event from "../models/Event";
import ImageGeneratorService from "../service/imageGenerator";
export class SubmissionController {
  private imageGenerator: ImageGeneratorService;

  constructor() {
    this.imageGenerator = new ImageGeneratorService();
  }

  async getSubmissions(req: Request, res: Response) {
    const submissions = await SubmissionModel.find({
      sessionId: req.sessionId,
    }).populate("selectedEvents.eventId");

    if (!submissions) {
      throw new AppError(404, "fail", "Submission not found");
    }
    res.json({ success: true, data: submissions });
  }

  async createSubmission(req: Request, res: Response) {
    const { temporaryUsername = "", selectedEvents, customEvents } = req.body;
    if (!selectedEvents) {
      throw new AppError(400, "fail", "Please select at least one event");
    }
    if (!Array.isArray(selectedEvents) || !Array.isArray(customEvents)) {
      throw new AppError(400, "fail", "Invalid submission details.");
    }
    // calculate total points
    const totalPoints: number = await this.calculateWrapTotalPoints(
      selectedEvents,
      customEvents
    );

    const shareCode = await generateShareCode();
    const submission = await SubmissionModel.create({
      selectedEvents,
      customEvents,
      temporaryUsername,
      sessionId: req.sessionId,
      shareCode,
      totalPoints,
    });

    res.status(201).json({ success: true, data: submission });
  }

  async calculateWrapTotalPoints(
    selectedEvents: any[],
    customEvents: any[]
  ): Promise<number> {
    // calculate total points based on selected events and custom events
    let totalPoints: number = 0;
    if (customEvents && customEvents.length > 0) {
      customEvents.forEach((elem) => {
        totalPoints += elem.points;
      });
    }
    if (selectedEvents && selectedEvents.length > 0) {
      const points = await Promise.all(
        selectedEvents.map(async (elem) => {
          const event = await Event.findById(elem.eventId);
          return event ? event.points : 0;
        })
      );
      totalPoints += points.reduce((acc, curr) => acc + curr, 0);
    }
    return totalPoints; // return total points
  }

  async getSubmission(req: Request, res: Response) {
    const submission = await SubmissionModel.findOne({
      _id: req.params.id,
    }).populate({
      path: "selectedEvents.eventId",
      model: "Event",
    });

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
    const uniqueShareCode: string = req.params.shareCode;
    if (!uniqueShareCode) {
      throw new AppError(400, "fail", "Invalid share code");
    }
    const submission = await SubmissionModel.findOne({
      shareCode: uniqueShareCode,
    }).populate({
      path: "selectedEvents.eventId",
      model: "Event",
    });

    if (!submission) {
      throw new AppError(404, "fail", "Submission not found");
    }

    res.json({ success: true, data: submission });
  }

  public generateWrapImage = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const submissionId = req.body.id;
      console.log({ submissionId });
      if (!submissionId) {
        throw new AppError(400, "fail", "Invalid request to generate image");
      }

      const submission = await SubmissionModel.findById(submissionId).populate<{
        selectedEvents: { eventId: IEvent }[];
      }>("selectedEvents.eventId");
      // .lean();

      if (!submission) {
        res.status(404).json({
          success: false,
          message: "Submission not found",
        });
        return;
      }

      const eventsList = [
        ...submission.customEvents.map((e) => e.title),
        ...submission.selectedEvents.map((e) => e.eventId.title),
      ];

      const imageUrl = await this.imageGenerator.generateImage(
        eventsList,
        submission.shareCode,
        submission.temporaryUsername
      );

      res.json({
        success: true,
        data: { imageUrl },
      });
    } catch (error) {
      console.error("Image generation error:", error);
      if (error instanceof AppError) {
        throw error;
      }
      res.status(500).json({
        success: false,
        message: "Failed to generate image",
      });
    }
  };
}
