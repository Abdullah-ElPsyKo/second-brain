import type { CaptureType } from "@prisma/client";
import { prisma } from "../db/client.js";

type CaptureDomainInput = {
  domainId?: string;
  newDomainName?: string;
};

export async function createCapture(
  content: string,
  type: CaptureType,
  tags: string[] = [],
  domain: CaptureDomainInput = {},
) {
  const domainRelation = domain.domainId
    ? { connect: { id: domain.domainId } }
    : domain.newDomainName
      ? {
          connectOrCreate: {
            where: { name: domain.newDomainName },
            create: { name: domain.newDomainName },
          },
        }
      : undefined;

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
      ...(domainRelation ? { domain: domainRelation } : {}),
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

export async function deleteCapture(id: string) {
  return prisma.capture.delete({
    where: { id },
  });
}
