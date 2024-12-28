import mongoose, { Schema } from "mongoose";
import { ITemplate } from "../types/models";

export enum ColorScheme {
  LIGHT = "light",
  DARK = "dark",
  CUSTOM = "custom",
}

export enum LayoutType {
  GRID = "grid",
  LIST = "list",
}

const TemplateSchema = new Schema({
  name: { type: String, required: true },
  previewUrl: { type: String, required: true },
  style: {
    backgroundColor: { type: String, required: true },
    fontFamily: { type: String, required: true },
    layout: {
      type: String,
      enum: Object.values(LayoutType),
      default: LayoutType.LIST,
      required: true,
    },
    colorScheme: {
      type: String,
      enum: Object.values(ColorScheme),
      default: ColorScheme.LIGHT,
      required: true,
    },
  },
  isDefault: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<ITemplate>("Template", TemplateSchema);
