import { getCurrentUser } from "@/lib/auth/dal";
import { createOrder } from "@/lib/actions/order.actions";
import { prisma } from "@/lib/prisma";
import { createRazorpayOrder, getRazorpayKeyId } from "@/lib/razorpay";

export const runtime = "nodejs";
export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Please sign in to pay." }, { status: 401 });
  try {
    const input = await request.json();
    const result = await createOrder({ ...input, paymentMethod: "RAZORPAY" });
    if (!result.success) return Response.json(result, { status: 400 });
    const order = await prisma.order.findFirst({ where: { id: result.orderId, userId: user.id }, select: { id: true, orderNumber: true, total: true, razorpayOrderId: true } });
    if (!order) return Response.json({ error: "Order was not found." }, { status: 404 });
    const razorpayOrder = order.razorpayOrderId ? { id: order.razorpayOrderId, amount: Math.round(order.total * 100), currency: "INR" } : await createRazorpayOrder(order.total, order.orderNumber);
    if (!order.razorpayOrderId) await prisma.order.update({ where: { id: order.id }, data: { razorpayOrderId: razorpayOrder.id } });
    return Response.json({ success: true, orderId: order.id, orderNumber: order.orderNumber, razorpayOrderId: razorpayOrder.id, amount: razorpayOrder.amount, currency: razorpayOrder.currency, keyId: getRazorpayKeyId() });
  } catch (error) {
    console.error("Payment order creation failed:", error);
    return Response.json({ error: error instanceof Error ? error.message : "Unable to start payment." }, { status: 500 });
  }
}
