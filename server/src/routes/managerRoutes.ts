import express from "express";
import {
  getManager,
  createManager,
  updateManager,
} from "../controllers/managerController.ts";

const router = express.Router();

router.get("/:cognitoId", getManager);
router.post("/", createManager);
router.get("/:cognitoId", updateManager);

export default router;
