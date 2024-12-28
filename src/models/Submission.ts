import mongoose, { Schema } from "mongoose";
import { ISubmission } from "../types/models";

export const CustomEventSchema = new Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    points: { type: Number, required: true },
  },
  { _id: false }
); // Disable _id for sub-documents

const SubmissionSchema = new Schema({
  temporaryUsername: { type: "string" },
  sessionId: { type: String, required: true },
  selectedEvents: [
    {
      eventId: {
        type: Schema.Types.ObjectId,
        ref: "Event",
        required: true,
      },
      _id: false, // Prevents MongoDB from creating _id for array items
    },
  ],
  customEvents: [CustomEventSchema],
  shareCode: { type: String, required: true, unique: true },
  totalPoints: { type: Number, default: 0 },
  status: { type: String, enum: ["draft", "completed"], default: "completed" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

SubmissionSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model<ISubmission>("Submission", SubmissionSchema);
