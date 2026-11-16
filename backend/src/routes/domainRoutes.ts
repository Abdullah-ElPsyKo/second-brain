import { Router } from "express";
import { domainController } from "../controllers/domainController.js";

export const domainRouter = Router();

domainRouter.get("/", domainController);
