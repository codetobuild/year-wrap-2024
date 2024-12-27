import { Router } from "express";
import { ShareController } from "../controllers/shareController";
import { asyncHandler } from "../middlewares";

const router = Router();
const shareController = new ShareController();

// POST /api/shares - Create a new share
router.post("/", asyncHandler(shareController.createShare));

// GET /api/shares/:shareCode - Get share by code
router.get("/:shareCode", asyncHandler(shareController.getShareByCode));

// POST /api/shares/:shareCode/view - Record a view
router.post("/:shareCode/view", asyncHandler(shareController.recordView));

export default router;
