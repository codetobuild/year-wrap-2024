import { Router } from "express";
import { CategoryController } from "../controllers/categoryController";
import { asyncHandler } from "../middlewares";

const router = Router();
const controller = new CategoryController();

router
  .route("/")
  .get(asyncHandler(controller.getCategories.bind(controller)))
  .post(asyncHandler(controller.createCategory.bind(controller)));

router
  .route("/:id")
  .put(asyncHandler(controller.updateCategory.bind(controller)))
  .delete(asyncHandler(controller.deleteCategory.bind(controller)));

router.get(
  "/slug/:slug",
  asyncHandler(controller.getCategoryBySlug.bind(controller))
);

export default router;
