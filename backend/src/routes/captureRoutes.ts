import { Router } from "express";
import { createCaptureController, getRecentCapturesController } from "../controllers/captureController.js";

export const captureRouter = Router();

captureRouter.post("/", createCaptureController);
captureRouter.get("/", getRecentCapturesController);