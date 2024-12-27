import mongoose, { Schema } from "mongoose";
import { IEvent } from "../types/models";

const EventSchema = new Schema({
  category: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  points: { type: Number, required: true },
  isAdult: { type: Boolean, default: false },
  order: { type: Number, required: true },
  icon: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IEvent>("Event", EventSchema);
