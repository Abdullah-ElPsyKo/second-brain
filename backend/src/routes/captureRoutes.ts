import { Router } from "express";
import { createCaptureController, getAllCapturesController, getRecentCapturesController } from "../controllers/captureController.js";

export const captureRouter = Router();

captureRouter.post("/", createCaptureController);
captureRouter.get("/recent", getRecentCapturesController);
captureRouter.get("/", getAllCapturesController);