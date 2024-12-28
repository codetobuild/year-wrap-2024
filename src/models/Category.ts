import { model, Schema } from "mongoose";
import { ICategory } from "../types";

const CategorySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  description: {
    type: String,
  },
  icon: {
    type: String,
  },
  order: {
    type: Number,
    required: true,
  },
  isAdult: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
});

// Add timestamps
CategorySchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

export default model<ICategory>("Category", CategorySchema);
