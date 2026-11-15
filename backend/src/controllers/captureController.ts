import type { Request, Response } from "express";
import { CaptureType } from "@prisma/client";
import {
  createCapture,
  getAllCaptures,
  getRecentCaptures,
} from "../services/captureService.js";

const VALID_TYPES = Object.values(CaptureType);

export async function createCaptureController(req: Request, res: Response) {
  const { content } = req.body;
  const rawType = typeof req.body.type === "string" ? req.body.type.toUpperCase() : undefined;
  const rawTags: unknown[] = Array.isArray(req.body.tags) ? req.body.tags : [];
  const tags = [
    ...new Set(
      rawTags
        .filter((t): t is string => typeof t === "string")
        .map((t) => t.trim())
        .filter(Boolean),
    ),
  ];

  if (typeof content !== "string" || !content.trim()) {
    res.status(400).json({
      error: "Content is required",
    });
    return;
  }

  if (!rawType || !(VALID_TYPES as readonly string[]).includes(rawType)) {
    res.status(400).json({
      error: "Invalid capture type",
    });
    return;
  }

  try {
    const capture = await createCapture(
      content.trim(),
      rawType as CaptureType,
      tags,
    );
    res.status(201).json(capture);
  } catch (error) {
    res.status(500).json({
      error: "Failed to create capture",
    });
  }
}

export async function getRecentCapturesController(req: Request, res: Response) {
  try {
    const captures = await getRecentCaptures();
    res.status(200).json(captures);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to retrieve captures",
    });
  }
}

export async function getAllCapturesController(req: Request, res: Response) {
  try {
    const captures = await getAllCaptures();
    res.status(200).json(captures);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to retrieve all captures",
    });
  }
}
