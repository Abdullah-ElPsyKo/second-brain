import { Router } from "express";
import {
  assignCaptureController,
  createCaptureController,
  deleteCaptureController,
  getAllCapturesController,
  getInboxCapturesController,
  getRecentCapturesController,
} from "../controllers/captureController.js";

export const captureRouter = Router();

captureRouter.post("/", createCaptureController);
captureRouter.get("/recent", getRecentCapturesController);
captureRouter.get("/inbox", getInboxCapturesController);
captureRouter.patch("/:id/assign", assignCaptureController);
captureRouter.get("/", getAllCapturesController);
captureRouter.delete("/:id", deleteCaptureController);
