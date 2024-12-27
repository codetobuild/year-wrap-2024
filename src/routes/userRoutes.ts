import { Router } from "express";
import { UserController } from "../controllers/userController";
import { asyncHandler } from "../middlewares";

const router = Router();
const controller = new UserController();

router
  .route("/")
  .get(asyncHandler(controller.getCurrentUser))
  .put(asyncHandler(controller.updateUser));

router.get("/stats", asyncHandler(controller.getUserStats));

export default router;
