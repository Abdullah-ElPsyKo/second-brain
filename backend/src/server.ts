import cors from "cors";
import express from "express";
import { captureRouter } from "./routes/captureRoutes.js";
import { tagsRouter } from "./routes/tagsRoutes.js";
import { domainRouter } from "./routes/domainRoutes.js";

export const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/captures", captureRouter);
app.use("/api/tags", tagsRouter);
app.use("/api/domain", domainRouter);
