import type { Request, Response } from "express";
import { createCapture, getRecentCaptures } from "../services/captureService.js";

export async function createCaptureController(
  req: Request,
  res: Response
) {
  const { content } = req.body;

  if (typeof content !== "string" || !content.trim()) {
    res.status(400).json({
      error: "Content is required"
    });
    return;
  }

  try {
    const capture = await createCapture(content.trim());
    res.status(201).json(capture);
  } catch (error) {
    res.status(500).json({
      error: "Failed to create capture"
    });
  }
}

export async function getRecentCapturesController(
    req: Request,
    res: Response
) {
    try {
        const captures = await getRecentCaptures();
        res.status(200).json(captures);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to retrieve captures"
        });
    }
}