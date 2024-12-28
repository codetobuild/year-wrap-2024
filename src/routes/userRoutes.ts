import { Router } from "express";
import { UserController } from "../controllers/userController";
import { asyncHandler } from "../middlewares";

const router = Router();
const controller = new UserController();

router
  .route("/")
  .get(asyncHandler(controller.getCurrentUser.bind(controller)))
  .put(asyncHandler(controller.updateUser.bind(controller)));

router.get("/stats", asyncHandler(controller.getUserStats.bind(controller)));

export default router;
