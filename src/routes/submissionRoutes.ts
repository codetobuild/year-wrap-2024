import { Router } from "express";
import { SubmissionController } from "../controllers/submissionController";
import { asyncHandler } from "../middlewares";

const router = Router();
const controller = new SubmissionController();

router
  .route("/")
  .get(asyncHandler(controller.getSubmissions))
  .post(asyncHandler(controller.createSubmission));

router.get("/code/:shareCode", asyncHandler(controller.getSubmissionByCode));

router
  .route("/:id")
  .get(asyncHandler(controller.getSubmission))
  .put(asyncHandler(controller.updateSubmission))
  .delete(asyncHandler(controller.deleteSubmission));

export default router;
