import { Router } from "express";
import { EventController } from "../controllers/eventController";
import { asyncHandler } from "../middlewares";

const router = Router();
const controller = new EventController();

router
  .route("/")
  .get(asyncHandler(controller.getEvents.bind(controller)))
  .post(asyncHandler(controller.createEvent.bind(controller)));

router
  .route("/:id")
  .get(asyncHandler(controller.getEventById.bind(controller)))
  .put(asyncHandler(controller.updateEvent.bind(controller)))
  .delete(asyncHandler(controller.deleteEvent.bind(controller)));

router.get(
  "/popular",
  asyncHandler(controller.getPopularEvents.bind(controller))
);

router.get(
  "/category/:slug",
  asyncHandler(controller.getEventsByCategory.bind(controller))
);

export default router;
