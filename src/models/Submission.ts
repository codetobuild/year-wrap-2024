import mongoose, { Schema } from "mongoose";
import { ISubmission } from "../types/models";

const SubmissionSchema = new Schema({
  temporaryUsername: { type: "string" },
  sessionId: { type: String, required: true },
  selectedEvents: [
    {
      eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
      timestamp: { type: Date, default: Date.now },
      order: { type: Number, required: true },
    },
  ],
  shareCode: { type: String, required: true, unique: true },
  templateId: { type: Schema.Types.ObjectId, ref: "Template", required: true },
  totalPoints: { type: Number, default: 0 },
  status: { type: String, enum: ["draft", "completed"], default: "draft" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
export default mongoose.model<ISubmission>("Submission", SubmissionSchema);
