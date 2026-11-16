import type { Request, Response } from "express";
import { CaptureType } from "@prisma/client";
import {
  assignCapture,
  createCapture,
  deleteCapture,
  getAllCaptures,
  getInboxCaptures,
  getRecentCaptures,
} from "../services/captureService.js";

const VALID_TYPES = Object.values(CaptureType);

export async function createCaptureController(req: Request, res: Response) {
  const { content } = req.body;
  const rawType =
    typeof req.body.type === "string" ? req.body.type.toUpperCase() : undefined;
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

export async function deleteCaptureController(
  req: Request<{ id: string }>,
  res: Response,
) {
  try {
    const capture = await deleteCapture(req.params.id);
    res.status(200).json(capture);
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: "Capture not found" });
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

export async function getInboxCapturesController(req: Request, res: Response) {
  try {
    const captures = await getInboxCaptures();
    res.status(200).json(captures);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to retrieve inbox captures",
    });
  }
}

export async function assignCaptureController(
  req: Request<{ id: string }>,
  res: Response,
) {
  const { title } = req.body;
  const domainId =
    typeof req.body.domainId === "string" ? req.body.domainId.trim() : "";
  const newDomainName =
    typeof req.body.newDomainName === "string"
      ? req.body.newDomainName.trim()
      : "";
  const rawTags: unknown[] = Array.isArray(req.body.tags) ? req.body.tags : [];
  const tags = [
    ...new Set(
      rawTags
        .filter((tag): tag is string => typeof tag === "string")
        .map((tag) => tag.trim())
        .filter(Boolean),
    ),
  ];

  if (typeof title !== "string") {
    res.status(400).json({ error: "Title must be a string" });
    return;
  }

  if (Boolean(domainId) === Boolean(newDomainName)) {
    res.status(400).json({
      error: "Choose an existing domain or provide a new domain name",
    });
    return;
  }

  if (!Array.isArray(req.body.tags)) {
    res.status(400).json({ error: "Tags must be an array" });
    return;
  }

  try {
    const capture = await assignCapture(req.params.id, {
      title: title.trim() || null,
      tags,
      domainId: domainId || undefined,
      newDomainName: newDomainName || undefined,
    });
    res.status(200).json(capture);
  } catch (error) {
    console.error(error);
    if (
      error !== null &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2025"
    ) {
      res.status(404).json({ error: "Capture or domain not found" });
      return;
    }
    res.status(500).json({ error: "Failed to assign capture" });
  }
}
