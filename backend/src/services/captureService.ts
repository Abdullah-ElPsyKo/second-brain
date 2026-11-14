import type { CaptureType } from "@prisma/client";
import { prisma } from "../db/client.js";

export async function createCapture(content: string, type: CaptureType) {
  return prisma.capture.create({
    data: {
      content: content,
      type: type
    }
  });
}

export async function getRecentCaptures() {
    return prisma.capture.findMany({
        orderBy: {
            createdAt: "desc"
        },
        take: 5
    });
}

export async function getAllCaptures() {
    return prisma.capture.findMany({
        orderBy: {
            createdAt: "desc"
        }
    });
}