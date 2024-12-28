import { Router } from "express";
import { SubmissionController } from "../controllers/submissionController";
import { asyncHandler } from "../middlewares";

const router = Router();
const controller = new SubmissionController();

router
  .route("/")
  // .get(asyncHandler(controller.getSubmissions.bind(controller)))
  .post(asyncHandler(controller.createSubmission.bind(controller)));

// router
//   .route("/:id")
//   .get(asyncHandler(controller.getSubmission.bind(controller)))
//   .put(asyncHandler(controller.updateSubmission.bind(controller)))
//   .delete(asyncHandler(controller.deleteSubmission.bind(controller)));

router.get(
  "/share/:shareCode",
  asyncHandler(controller.getSubmissionByCode.bind(controller))
);

export default router;
