import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import EventModel from "../models/Event";
import CategoryModel from "../models/Category";
import { AppError } from "../types";

export class EventController {
  async getEvents(req: Request, res: Response) {
    const { categoryId, isActive } = req.query;
    const query: any = {};

    if (categoryId && isValidObjectId(categoryId)) {
      query.categoryId = categoryId;
    } else if (categoryId) {
      res.json({ success: false, data: [] });
    }
    if (isActive) {
      query.isActive = isActive === "true";
    }

    const events = await EventModel.find(query)
      .populate("categoryId")
      .sort({ order: 1 });

    res.json({ success: true, data: events });
  }

  async getEventById(req: Request, res: Response) {
    const event = await EventModel.findById(req.params.id).populate(
      "categoryId"
    );
    if (!event) {
      throw new AppError(404, "fail", "Event not found");
    }
    res.json({ success: true, data: event });
  }

  async createEvent(req: Request, res: Response) {
    // Verify category exists
    const category = await CategoryModel.findById(req.body.categoryId);
    if (!category) {
      throw new AppError(404, "fail", "Category not found");
    }

    const event = await EventModel.create(req.body);
    res.status(201).json({ success: true, data: event });
  }

  async updateEvent(req: Request, res: Response) {
    // If categoryId is being updated, verify it exists
    if (req.body.categoryId) {
      const category = await CategoryModel.findById(req.body.categoryId);
      if (!category) {
        throw new AppError(404, "fail", "Category not found");
      }
    }

    const event = await EventModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).populate("categoryId");

    if (!event) {
      throw new AppError(404, "fail", "Event not found");
    }
    res.json({ success: true, data: event });
  }

  async deleteEvent(req: Request, res: Response) {
    const event = await EventModel.findByIdAndDelete(req.params.id);
    if (!event) {
      throw new AppError(404, "fail", "Event not found");
    }
    res.json({ success: true, message: "Event deleted successfully" });
  }

  async getEventsByCategory(req: Request, res: Response) {
    const { slug } = req.params;
    const { isActive = true } = req.query;

    const category = await CategoryModel.findOne({ slug });
    if (!category) {
      throw new AppError(404, "fail", "Category not found");
    }

    const query = {
      categoryId: category._id,
      ...(isActive !== undefined ? { isActive: isActive === "true" } : {}),
    };

    const events = await EventModel.find(query)
      .populate("categoryId")
      .sort({ order: 1 });

    res.json({
      success: true,
      data: {
        category,
        events,
      },
    });
  }

  async getPopularEvents(req: Request, res: Response) {
    const { categoryId } = req.query;
    const query: any = { isActive: true };

    if (categoryId) query.categoryId = categoryId;

    const events = await EventModel.find(query)
      .populate("categoryId")
      .sort({ points: -1 })
      .limit(10);

    res.json({ success: true, data: events });
  }
}
