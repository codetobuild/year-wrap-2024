import mongoose, { Schema } from "mongoose";
import { IAnalytics } from "../types/models";

const AnalyticsSchema = new Schema({
  type: { type: String, required: true },
  sessionId: { type: String, required: true },
  metadata: {
    resourceId: { type: Schema.Types.ObjectId, required: true },
    resourceType: { type: String, required: true },
    platform: { type: String },
  },
  timestamp: { type: Date, default: Date.now },
  country: { type: String },
});

export default mongoose.model<IAnalytics>("Analytics", AnalyticsSchema);
