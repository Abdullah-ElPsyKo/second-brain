import { prisma } from "../db/client.js";

export async function getDomains() {
  return prisma.domain.findMany({
    orderBy: {
      name: "desc",
    },
  });
}