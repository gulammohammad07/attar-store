import "server-only";

import { createHmac, timingSafeEqual } from "crypto";

const API = "https://api.razorpay.com/v1";
function credentials() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) throw new Error("Razorpay is not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.");
  return { keyId, keySecret };
}
export function getRazorpayKeyId() { return process.env.RAZORPAY_KEY_ID ?? ""; }
export async function createRazorpayOrder(amount: number, receipt: string) {
  const { keyId, keySecret } = credentials();
  const response = await fetch(`${API}/orders`, { method: "POST", headers: { Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`, "Content-Type": "application/json" }, body: JSON.stringify({ amount: Math.round(amount * 100), currency: "INR", receipt, payment_capture: 1 }), cache: "no-store" });
  if (!response.ok) throw new Error("Razorpay could not create a payment order.");
  return response.json() as Promise<{ id: string; amount: number; currency: string }>;
}
export function verifyRazorpaySignature(orderId: string, paymentId: string, signature: string) {
  const { keySecret } = credentials();
  const expected = createHmac("sha256", keySecret).update(`${orderId}|${paymentId}`).digest("hex");
  const expectedBuffer = Buffer.from(expected, "utf8");
  const receivedBuffer = Buffer.from(signature, "utf8");
  return expectedBuffer.length === receivedBuffer.length && timingSafeEqual(expectedBuffer, receivedBuffer);
}
