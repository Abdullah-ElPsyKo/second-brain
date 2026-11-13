import { prisma } from "../db/client.js";

export async function createCapture(content: string) {
  return prisma.capture.create({
    data: {
      content: content
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