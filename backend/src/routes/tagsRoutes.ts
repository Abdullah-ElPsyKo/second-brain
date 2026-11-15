import { Router } from "express";
import { uniqueTagsController } from "../controllers/tagsController.js";

export const tagsRouter = Router();

tagsRouter.get("/", uniqueTagsController);
