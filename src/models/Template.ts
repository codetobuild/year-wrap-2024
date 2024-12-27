import mongoose, { Schema } from "mongoose";
import { ITemplate } from "../types/models";

const TemplateSchema = new Schema({
  name: { type: String, required: true },
  previewUrl: { type: String, required: true },
  style: {
    backgroundColor: { type: String, required: true },
    fontFamily: { type: String, required: true },
    layout: { type: String, required: true },
    colorScheme: { type: String, required: true },
  },
  isDefault: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<ITemplate>("Template", TemplateSchema);
