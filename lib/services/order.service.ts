import { prisma } from "@/lib/prisma";

/** "active" hides admin-deleted orders; "deleted" shows only those. */
export type OrderView = "active" | "deleted";

export type OrderFilters = {
  search?: string;
  from?: string;
  to?: string;
  view?: OrderView;
};

/**
 * Search/date clauses only — deliberately ignores `hiddenFromAdmin` so callers
 * that need complete figures (revenue totals, CSV export) still see orders the
 * admin has removed from their list.
 */
export function buildOrderSearchWhere(filters: OrderFilters = {}) {
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

/** Search/date clauses plus the admin visibility filter. */
export function buildOrderWhere(
  filters: OrderFilters = {},
): Record<string, unknown> {
  const where = buildOrderSearchWhere(filters);
  where.hiddenFromAdmin = filters.view === "deleted";
  return where;
}

export type OrderWithItems = {
  id: string;
  orderNumber: string;
  idempotencyKey: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  subtotal: number;
  shippingFee: number;
  total: number;
  occasion: string | null;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  hiddenFromAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
  items: {
    id: string;
    orderId: string;
    productId: string | null;
    productName: string;
    productImage: string | null;
    unitPrice: number;
    quantity: number;
    lineTotal: number;
  }[];
  user: {
    id: string;
    name: string;
    email: string;
  };
};

/**
 * The customer's own order history. Intentionally does NOT filter on
 * `hiddenFromAdmin` — an admin removing an order from their panel must never
 * make it disappear for the customer who placed it.
 */
export async function getOrdersByUser(userId: string): Promise<OrderWithItems[]> {
  return prisma.order.findMany({
    where: { userId },
    include: {
      items: {
        orderBy: { id: "asc" },
        select: {
          id: true,
          orderId: true,
          productId: true,
          productName: true,
          productImage: true,
          unitPrice: true,
          quantity: true,
          lineTotal: true,
        },
      },
      user: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAllOrders(filters: OrderFilters = {}): Promise<OrderWithItems[]> {
  return prisma.order.findMany({
    where: buildOrderWhere(filters),
    include: {
      items: {
        orderBy: { id: "asc" },
        select: {
          id: true,
          orderId: true,
          productId: true,
          productName: true,
          productImage: true,
          unitPrice: true,
          quantity: true,
          lineTotal: true,
        },
      },
      user: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export type OrderTotals = {
  totalOrders: number;
  deliveredRevenue: number;
  pendingRevenue: number;
  hiddenCount: number;
};

/**
 * Totals across every matching order, including ones the admin has deleted from
 * their list — the money was still collected, so it stays in the figures.
 */
export async function getOrderTotals(
  filters: OrderFilters = {},
): Promise<OrderTotals> {
  const searchWhere = buildOrderSearchWhere(filters);
  const hiddenWhere: Record<string, unknown> = {
    ...searchWhere,
    hiddenFromAdmin: true,
  };

  const [totalOrders, hiddenCount, byStatus] = await Promise.all([
    prisma.order.count({ where: searchWhere }),
    prisma.order.count({ where: hiddenWhere }),
    prisma.order.groupBy({
      by: ["status"],
      where: searchWhere,
      _sum: { total: true },
    }),
  ]);

  let deliveredRevenue = 0;
  let pendingRevenue = 0;
  for (const row of byStatus) {
    const sum = row._sum.total ?? 0;
    if (row.status === "DELIVERED") deliveredRevenue += sum;
    else pendingRevenue += sum;
  }

  return { totalOrders, deliveredRevenue, pendingRevenue, hiddenCount };
}
