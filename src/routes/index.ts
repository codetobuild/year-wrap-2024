import { Router } from "express";
import userRoutes from "./userRoutes";
import eventRoutes from "./eventRoutes";
import categoryRoutes from "./categoryRoutes";
import submissionRoutes from "./submissionRoutes";
// import shareRoutes from "./shareRoutes";
import templateRoutes from "./templateRoutes";

const router = Router();

// API routes
router.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

router.use("/users", userRoutes);
router.use("/events", eventRoutes);
router.use("/categories", categoryRoutes);
router.use("/submissions", submissionRoutes);
router.use("/templates", templateRoutes);
// router.use("/shares", shareRoutes);

// Error handling for undefined routes
router.use("*", (req, res) => {
  res.status(404).json({
    status: "error",
    message: `Can't find resource on this server!`,
  });
});

export default router;
