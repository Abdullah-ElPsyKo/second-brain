import cors from "cors";
import express from "express";
import { captureRouter } from "./routes/captureRoutes.js";

export const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/captures", captureRouter);