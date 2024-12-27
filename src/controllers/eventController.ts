import { Request, Response, NextFunction } from "express";
import { BaseController } from "./baseController";
import EventModel from "../models/Event";

export class EventController extends BaseController {
  async getEvents(req: Request, res: Response, next: NextFunction) {
    await this.handleRequest(req, res, next, async () => {
      const { category, isAdult } = req.query;
      const query: any = {};

      if (category) query.category = category;
      if (isAdult !== undefined) query.isAdult = isAdult === "true";

      return await EventModel.find(query).sort({ order: 1 });
    });
  }

  async getEventById(req: Request, res: Response, next: NextFunction) {
    await this.handleRequest(req, res, next, async () => {
      const event = await EventModel.findById(req.params.id);
      if (!event) this.handleError("Event not found");
      return event;
    });
  }

  async createEvent(req: Request, res: Response, next: NextFunction) {
    await this.handleRequest(req, res, next, async () => {
      return await EventModel.create(req.body);
    });
  }

  async updateEvent(req: Request, res: Response, next: NextFunction) {
    await this.handleRequest(req, res, next, async () => {
      const event = await EventModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!event) this.handleError("Event not found");
      return event;
    });
  }

  async deleteEvent(req: Request, res: Response, next: NextFunction) {
    await this.handleRequest(req, res, next, async () => {
      const event = await EventModel.findByIdAndDelete(req.params.id);
      if (!event) this.handleError("Event not found");
      return { message: "Event deleted successfully" };
    });
  }

  async getCategories(req: Request, res: Response, next: NextFunction) {
    await this.handleRequest(req, res, next, async () => {
      return await EventModel.distinct("category");
    });
  }

  async getPopularEvents(req: Request, res: Response, next: NextFunction) {
    await this.handleRequest(req, res, next, async () => {
      return await EventModel.find().sort({ points: -1 }).limit(10);
    });
  }
}
