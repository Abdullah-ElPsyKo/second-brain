import { Router } from "express";
import { createCaptureController, deleteCaptureController, getAllCapturesController, getRecentCapturesController } from "../controllers/captureController.js";

export const captureRouter = Router();

captureRouter.post("/", createCaptureController);
captureRouter.get("/recent", getRecentCapturesController);
captureRouter.get("/", getAllCapturesController);
captureRouter.delete("/:id", deleteCaptureController);