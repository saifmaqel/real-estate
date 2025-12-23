import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.ts";
import multer from "multer";
import {
  getProperties,
  getProperty,
  createProperty,
} from "../controllers/propertyControllers.ts";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.get("/", getProperties);
router.get("/:id", getProperty);
router.post(
  "/",
  authMiddleware(["manager"]),
  upload.array("photos"),
  createProperty
);

export default router;
