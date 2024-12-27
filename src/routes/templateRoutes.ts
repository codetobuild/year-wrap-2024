import { Router } from "express";
import { TemplateController } from "../controllers/templateController";
import { asyncHandler } from "../middlewares";

const router = Router();
const templateController = new TemplateController();

// GET /api/templates - Get all active templates
router.get("/", asyncHandler(templateController.getTemplates));

// GET /api/templates/:templateId - Get template by ID
router.get("/:templateId", asyncHandler(templateController.getTemplateById));

export default router;
