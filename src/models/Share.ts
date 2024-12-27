import mongoose, { Schema } from "mongoose";
import { IShare } from "../types/models";

const ShareSchema = new Schema({
  shareCode: { type: String, required: true, unique: true },
  submissionId: {
    type: Schema.Types.ObjectId,
    ref: "Submission",
    required: true,
  },
  views: { type: Number, default: 0 },
  shares: [
    {
      platform: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IShare>("Share", ShareSchema);
