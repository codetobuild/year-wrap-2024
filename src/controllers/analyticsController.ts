import { Request, Response } from "express";
import AnalyticsModel from "../models/Analytics";
import EventModel from "../models/Event";

export class AnalyticsController {
  async trackEvent(req: Request, res: Response) {
    const analytics = await AnalyticsModel.create({
      ...req.body,
      sessionId: req.sessionId,
      timestamp: new Date(),
    });
    res.status(201).json({ status: "success", data: analytics });
  }

  async getPopularEvents(req: Request, res: Response) {
    const popularEvents = await AnalyticsModel.aggregate([
      {
        $match: {
          type: "event_select",
          timestamp: {
            $gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
          },
        },
      },
      {
        $group: {
          _id: "$metadata.resourceId",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 10,
      },
    ]);

    const eventIds = popularEvents.map((event) => event._id);
    const events = await EventModel.find({ _id: { $in: eventIds } });

    res.json({ status: "success", data: events });
  }

  async getTrends(req: Request, res: Response) {
    const trends = await AnalyticsModel.aggregate([
      {
        $match: {
          timestamp: {
            $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
          },
        },
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
            type: "$type",
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.date": 1 },
      },
    ]);

    res.json({ status: "success", data: trends });
  }
}
