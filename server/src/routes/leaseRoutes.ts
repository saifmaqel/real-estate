import express from "express";
import {
  getLeasePayments,
  getLeases,
} from "../controllers/leaseControllers.ts";
import { authMiddleware } from "../middleware/authMiddleware.ts";

const router = express.Router();

router.use("/", authMiddleware(["manager", "tenant"]), getLeases);
router.use(
  "/:id/payments",
  authMiddleware(["manager", "tenant"]),
  getLeasePayments
);

export default router;
