import { Document, Types } from "mongoose";

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

export interface ICategory extends Document {
  name: string;
  description?: string;
  icon?: string;
  order: number;
  isAdult: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export interface IEvent extends Document {
  categoryId: Types.ObjectId;
  title: string;
  description: string;
  points: number;
  icon?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export interface ICustomEvent {
  id: string;
  title: string;
  points: number;
}

export interface ISubmission extends Document {
  temporaryUsername: string;
  sessionId: string;
  selectedEvents: Array<{
    eventId: string;
  }>;
  customEvents: ICustomEvent[];
  shareCode: string;
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
