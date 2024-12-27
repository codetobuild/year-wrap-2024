import { Document } from "mongoose";

export interface IUser extends Document {
  sessionId: string;
  createdAt: Date;
  device: {
    type: string;
    browser: string;
    userAgent: string;
  };
  country?: string;
  lastActive: Date;
}

export interface IEvent extends Document {
  category: string;
  title: string;
  description: string;
  points: number;
  isAdult: boolean;
  order: number;
  icon: string;
  createdAt: Date;
  isActive: boolean;
}

export interface ISubmission extends Document {
  sessionId: string;
  selectedEvents: Array<{
    eventId: string;
    timestamp: Date;
    order: number;
  }>;
  shareCode: string;
  templateId: string;
  totalPoints: number;
  status: "draft" | "completed";
  createdAt: Date;
  updatedAt: Date;
}

export interface ITemplate extends Document {
  name: string;
  previewUrl: string;
  style: {
    backgroundColor: string;
    fontFamily: string;
    layout: string;
    colorScheme: string;
  };
  isDefault: boolean;
  isActive: boolean;
  createdAt: Date;
}

export interface IAnalytics extends Document {
  type: string;
  sessionId: string;
  metadata: {
    resourceId: string;
    resourceType: string;
    platform?: string;
  };
  timestamp: Date;
  country?: string;
}

export interface IShare extends Document {
  shareCode: string;
  submissionId: string;
  views: number;
  shares: Array<{
    platform: string;
    timestamp: Date;
  }>;
  createdAt: Date;
}
