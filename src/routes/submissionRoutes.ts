import { Router } from "express";
import { SubmissionController } from "../controllers/submissionController";
import { asyncHandler } from "../middlewares";

const router = Router();
const controller = new SubmissionController();

router
  .route("/")
  .post(asyncHandler(controller.createSubmission.bind(controller)));

router
  .route("/generate-image")
  .post(asyncHandler(controller.generateWrapImage.bind(controller)));

router
  .route("/:id")
  .get(asyncHandler(controller.getSubmission.bind(controller)));

router.get(
  "/share/:shareCode",
  asyncHandler(controller.getSubmissionByCode.bind(controller))
);

export default router;
