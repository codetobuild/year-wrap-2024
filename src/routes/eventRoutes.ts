import { Router } from "express";
import { EventController } from "../controllers/eventController";
import { asyncHandler } from "../middlewares";
const router = Router();
const controller = new EventController();

router
  .route("/")
  .get(asyncHandler(controller.getEvents))
  .post(asyncHandler(controller.createEvent));

router.get("/categories", asyncHandler(controller.getCategories));
router.get("/popular", asyncHandler(controller.getPopularEvents));

router
  .route("/:id")
  .get(controller.getEventById)
  .put(controller.updateEvent)
  .delete(controller.deleteEvent);

export default router;
