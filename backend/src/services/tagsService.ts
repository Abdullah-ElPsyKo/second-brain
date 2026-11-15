import { prisma } from "../db/client.js";

export async function getUniqueTags() {
  return prisma.tag.findMany({
    orderBy: {
      name: "desc",
    },
  });
}