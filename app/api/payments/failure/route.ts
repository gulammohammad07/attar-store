import { getCurrentUser } from "@/lib/auth/dal";
import { prisma } from "@/lib/prisma";
export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Unauthorized." }, { status: 401 });
  const { orderId } = await request.json().catch(() => ({}));
  if (typeof orderId === "string") await prisma.order.updateMany({ where: { id: orderId, userId: user.id, paymentMethod: "RAZORPAY", paymentStatus: "PENDING" }, data: { paymentStatus: "FAILED" } });
  return Response.json({ success: true });
}
