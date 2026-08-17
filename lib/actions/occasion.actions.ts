"use server";

import { prisma } from "@/lib/prisma";

export type ActiveOccasion = {
  id: string;
  name: string;
};

export async function getActiveOccasions(): Promise<ActiveOccasion[]> {
  return prisma.occasion.findMany({
    where: { isActive: true },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
}
