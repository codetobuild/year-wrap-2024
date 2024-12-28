import { Request, Response } from "express";
import Category from "../models/Category";
import { AppError } from "../types";

export class CategoryController {
  async getCategories(req: Request, res: Response) {
    const { isAdult, isActive } = req.query;
    const query: any = {};

    if (isAdult) {
      query.isAdult = isAdult === "true";
    }
    if (isActive) {
      query.isActive = isActive === "true";
    }

    console.log(query);
    const results = await Category.find(query).sort({ order: 1 });
    console.log({ categories: results });
    res.json({ success: true, data: results });
  }

  async getCategoryBySlug(req: Request, res: Response) {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) {
      throw new AppError(404, "fail", "Category not found");
    }
    res.json({ success: true, data: category });
  }

  async createCategory(req: Request, res: Response) {
    const category = await Category.create(req.body);
    res.status(201).json({ success: true, data: category });
  }

  async updateCategory(req: Request, res: Response) {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!category) {
      throw new AppError(404, "fail", "Category not found");
    }
    res.json({ success: true, data: category });
  }

  async deleteCategory(req: Request, res: Response) {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      throw new AppError(404, "fail", "Category not found");
    }
    res.json({ success: true, message: "Category deleted successfully" });
  }
}
