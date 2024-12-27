import { Request, Response } from "express";
import { AppError } from "../types";
import TemplateModel from "../models/Template";

export class TemplateController {
  async getTemplates(req: Request, res: Response) {
    const templates = await TemplateModel.find({ isActive: true });
    res.json({ status: "success", data: templates });
  }

  async getTemplateById(req: Request, res: Response) {
    const template = await TemplateModel.findOne({
      _id: req.params.templateId,
      isActive: true,
    });

    if (!template) {
      throw new AppError(404, "fail", "Template not found");
    }

    res.json({ status: "success", data: template });
  }
}

