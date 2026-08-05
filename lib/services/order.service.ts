import { prisma } from "@/lib/prisma";

export async function getOrdersByUser(userId: string) {
  return prisma.order.findMany({
    where: { userId },
    include: {
      items: { orderBy: { id: "asc" } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAllOrders() {
  return prisma.order.findMany({
    include: {
      items: { orderBy: { id: "asc" } },
      user: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}
