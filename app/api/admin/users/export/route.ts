import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/dal";

export const dynamic = "force-dynamic";

const csvCell = (value: string | number | boolean | Date | null) => `"${String(value ?? "").replace(/"/g, '""')}"`;

export async function GET() {
  await requireAdmin();
  const users = await prisma.user.findMany({
    select: { name: true, email: true, role: true, provider: true, emailVerified: true, createdAt: true, _count: { select: { orders: true } } },
    orderBy: { createdAt: "desc" },
  });
  const rows = [["Name", "Email", "Role", "Provider", "Email verified", "Orders", "Joined"], ...users.map((user) => [user.name, user.email, user.role, user.provider, user.emailVerified?.toISOString() ?? "", user._count.orders, user.createdAt.toISOString()].map(csvCell))];
  return new Response(rows.map((row) => row.join(",")).join("\n"), { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": 'attachment; filename="users.csv"' } });
}
