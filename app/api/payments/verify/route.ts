import { getCurrentUser } from "@/lib/auth/dal";
import { prisma } from "@/lib/prisma";
import { verifyRazorpaySignature } from "@/lib/razorpay";

export const runtime = "nodejs";
export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Please sign in to verify payment." }, { status: 401 });
  try {
    const { orderId, razorpay_payment_id: paymentId, razorpay_order_id: razorpayOrderId, razorpay_signature: signature } = await request.json();
    if (![orderId, paymentId, razorpayOrderId, signature].every((value) => typeof value === "string")) return Response.json({ error: "Invalid payment response." }, { status: 400 });
    const order = await prisma.order.findFirst({ where: { id: orderId, userId: user.id, paymentMethod: "RAZORPAY" }, select: { id: true, orderNumber: true, razorpayOrderId: true, paymentStatus: true } });
    if (!order || order.razorpayOrderId !== razorpayOrderId) return Response.json({ error: "Payment order does not match." }, { status: 400 });
    if (!verifyRazorpaySignature(razorpayOrderId, paymentId, signature)) return Response.json({ error: "Payment verification failed." }, { status: 400 });
    if (order.paymentStatus !== "PAID") {
      await prisma.order.update({ where: { id: order.id }, data: { paymentStatus: "PAID", status: "CONFIRMED", razorpayPaymentId: paymentId, razorpaySignature: signature } });
      // Notify the store once an online order is actually paid.
      try {
        const fullOrder = await prisma.order.findUnique({ where: { id: order.id }, include: { items: { select: { productName: true, quantity: true, unitPrice: true, lineTotal: true } } } });
        if (fullOrder) {
          const { sendNewOrderNotificationMail } = await import("@/lib/services/order-mail.service");
          void sendNewOrderNotificationMail(fullOrder);
        }
      } catch (error) { console.error("Failed to send admin order notification:", error); }
    }
    return Response.json({ success: true, orderNumber: order.orderNumber });
  } catch (error) { console.error("Payment verification failed:", error); return Response.json({ error: "Could not verify payment." }, { status: 500 }); }
}
