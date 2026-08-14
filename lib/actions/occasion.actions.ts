"use server";

import { prisma } from "@/lib/prisma";

export async function getActiveOccasions() {
  return prisma.occasion.findMany({
    where: { isActive: true },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
}
