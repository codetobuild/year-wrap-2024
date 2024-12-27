import mongoose, { Schema } from "mongoose";
import { IUser } from "../types";

const UserSchema = new Schema({
  sessionId: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  device: {
    type: { type: String, required: true },
    browser: { type: String, required: true },
    userAgent: { type: String, required: true },
  },
  country: { type: String },
  lastActive: { type: Date, default: Date.now },
});

export default mongoose.model<IUser>("User", UserSchema);
