import type { CaptureType } from "@prisma/client";
import { prisma } from "../db/client.js";

export async function createCapture(
  content: string,
  type: CaptureType,
  tags: string[] = [],
) {
  return prisma.capture.create({
    data: {
      content: content,
      type: type,
      tags: {
        connectOrCreate: tags.map((name) => ({
          where: { name },
          create: { name },
        })),
      },
    },
    include: { tags: true },
  });
}

export async function getRecentCaptures() {
  return prisma.capture.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
    include: { tags: true },
  });
}

export async function getAllCaptures() {
  return prisma.capture.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: { tags: true },
  });
}

export async function deleteCapture(id: string) {
  return prisma.capture.delete({
    where: { id },
  });
}