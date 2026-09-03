import { getCurrentUser } from "@/lib/auth/dal";
import { ROLES } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma";
import { buildOrderSearchWhere } from "@/lib/services/order.service";

export const runtime = "nodejs";

function csvCell(value: unknown): string {
  const text = String(value ?? "");
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function toCsv(rows: (string | number | null)[][]): string {
  return rows.map((row) => row.map(csvCell).join(",")).join("\r\n");
}

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== ROLES.ADMIN) {
    return Response.json({ success: false, error: "Unauthorized." }, { status: 401 });
  }

  const url = new URL(request.url);
  const search = url.searchParams.get("search") ?? "";
  const from = url.searchParams.get("from") ?? "";
  const to = url.searchParams.get("to") ?? "";

  const orders = await prisma.order.findMany({
    // Uses the search-only filter so the export stays a complete record and
    // still includes orders the admin has removed from their list.
    where: buildOrderSearchWhere({ search, from, to }),
    include: {
      items: { orderBy: { id: "asc" } },
      user: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const headers = [
    "Order Number",
    "Date",
    "Customer Name",
    "Customer Email",
    "Customer Phone",
    "Street",
    "City",
    "State",
    "Pincode",
    "Occasion",
    "Items",
    "Subtotal",
    "Shipping",
    "Total",
    "Status",
    "Payment Status",
  ];

  const rows = orders.map((order) => {
    const itemsText = order.items
      .map((item) => `${item.productName} x${item.quantity} (${item.lineTotal})`)
      .join(" | ");

    return [
      order.orderNumber,
      order.createdAt.toISOString(),
      order.customerName,
      order.customerEmail,
      order.customerPhone,
      order.street,
      order.city,
      order.state,
      order.pincode,
      order.occasion ?? "",
      itemsText,
      order.subtotal,
      order.shippingFee,
      order.total,
      order.status,
      order.paymentStatus,
    ];
  });

  const csv = "\uFEFF" + toCsv([headers, ...rows]);
  const date = new Date().toISOString().slice(0, 10);

  return new Response(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="orders-${date}.csv"`,
    },
  });
}
