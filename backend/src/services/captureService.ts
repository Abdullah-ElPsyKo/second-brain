import type { CaptureType } from "@prisma/client";
import { prisma } from "../db/client.js";

type AssignCaptureInput = {
  title: string | null;
  tags: string[];
  domainId?: string;
  newDomainName?: string;
};

export async function createCapture(
  content: string,
  type: CaptureType,
  tags: string[] = [],
) {
  return prisma.capture.create({
    data: {
      content,
      type,
      tags: {
        connectOrCreate: tags.map((name) => ({
          where: { name },
          create: { name },
        })),
      },
    },
    include: { tags: true, domain: true },
  });
}

export async function getRecentCaptures() {
  return prisma.capture.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
    include: { tags: true, domain: true },
  });
}

export async function getAllCaptures() {
  return prisma.capture.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: { tags: true, domain: true },
  });
}

export async function getInboxCaptures() {
  return prisma.capture.findMany({
    where: { status: "INBOX" },
    orderBy: { createdAt: "desc" },
    include: { tags: true, domain: true },
  });
}

export async function assignCapture(id: string, input: AssignCaptureInput) {
  const domainRelation = input.domainId
    ? { connect: { id: input.domainId } }
    : {
        connectOrCreate: {
          where: { name: input.newDomainName! },
          create: { name: input.newDomainName! },
        },
      };

  return prisma.capture.update({
    where: { id },
    data: {
      title: input.title,
      status: "ACTIVE",
      domain: domainRelation,
      tags: {
        set: [],
        connectOrCreate: input.tags.map((name) => ({
          where: { name },
          create: { name },
        })),
      },
    },
    include: { tags: true, domain: true },
  });
}

export async function deleteCapture(id: string) {
  return prisma.capture.delete({
    where: { id },
  });
}
