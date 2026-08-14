import { prisma } from "@/lib/prisma";

export type OrderFilters = {
  search?: string;
  from?: string;
  to?: string;
};

export function buildOrderWhere(filters: OrderFilters = {}) {
  const where: Record<string, unknown> = {};

  const search = (filters.search ?? "").trim().toLowerCase();
  if (search) {
    where.OR = [
      { orderNumber: { contains: search, mode: "insensitive" } },
      { id: { contains: search, mode: "insensitive" } },
      { customerName: { contains: search, mode: "insensitive" } },
      { customerEmail: { contains: search, mode: "insensitive" } },
    ];
  }

  const gte = filters.from ? new Date(`${filters.from}T00:00:00`) : undefined;
  const lte = filters.to ? new Date(`${filters.to}T23:59:59.999`) : undefined;

  if (gte && lte) {
    where.createdAt = { gte, lte };
  } else if (gte) {
    where.createdAt = { gte };
  } else if (lte) {
    where.createdAt = { lte };
  }

  return where;
}

export async function getOrdersByUser(userId: string) {
  return prisma.order.findMany({
    where: { userId },
    include: {
      items: { orderBy: { id: "asc" } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAllOrders(filters: OrderFilters = {}) {
  return prisma.order.findMany({
    where: buildOrderWhere(filters),
    include: {
      items: { orderBy: { id: "asc" } },
      user: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}
