import express from "express";
import {
  getApplecations,
  createApplication,
  updateApplicationStatus,
} from "../controllers/applicationsControllers.ts";
import { authMiddleware } from "../middleware/authMiddleware.ts";

const router = express.Router();

router.get("/", authMiddleware(["manager", "tenant"]), getApplecations);
router.post("/", authMiddleware(["tenant"]), createApplication);
router.put("/:id/status", authMiddleware(["manager"]), updateApplicationStatus);

export default router;
