"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CreditCard, Loader2, Lock } from "lucide-react";
import { useCart } from "@/lib/store/cart-context";
import { useAuth } from "@/lib/store/auth-context";
import { createOrder } from "@/lib/actions/order.actions";
import { formatPrice } from "@/lib/utils";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const { user, status } = useAuth();
  const [placed, setPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const idempotencyKeyRef = useRef<string | null>(null);

  const shipping = subtotal >= 1500 ? 0 : 99;
  const total = subtotal + shipping;

  const getIdempotencyKey = () => {
    if (!idempotencyKeyRef.current) {
      idempotencyKeyRef.current =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `ck-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    }
    return idempotencyKeyRef.current;
  };

  const handlePlaceOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    setError(null);

    if (status === "loading") return;

    if (!user) {
      router.push("/sign-in?next=/checkout");
      return;
    }

    if (items.length === 0) {
      setError("Your cart is empty. Add products before checking out.");
      return;
    }

    setSubmitting(true);
    const form = new FormData(e.currentTarget);
    const result = await createOrder({
      idempotencyKey: getIdempotencyKey(),
      customerName: `${form.get("firstName") ?? ""} ${form.get("lastName") ?? ""}`.trim(),
      customerEmail: (form.get("email") as string) ?? "",
      customerPhone: (form.get("phone") as string) ?? "",
      street: (form.get("street") as string) ?? "",
      city: (form.get("city") as string) ?? "",
      state: (form.get("state") as string) ?? "",
      pincode: (form.get("pincode") as string) ?? "",
      items: items.map(({ product, quantity }) => ({
        productId: product.id,
        quantity,
      })),
    });

    if (!result.success) {
      if (result.notAuthenticated) {
        router.push("/sign-in?next=/checkout");
        return;
      }
      setError(result.error);
      setSubmitting(false);
      return;
    }

    clearCart();
    setOrderNumber(result.orderNumber);
    setPlaced(true);
    setSubmitting(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (placed) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 bg-[#F7F3EC] px-6 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="flex h-24 w-24 items-center justify-center rounded-full bg-green-100"
        >
          <span className="text-4xl text-green-600">✓</span>
        </motion.div>
        <h1 className="font-display text-5xl font-medium text-[#1c1712]">
          Thank You
        </h1>
        <p className="max-w-md text-sm leading-relaxed text-[#1c1712]/55">
          Your order has been placed successfully.
          {orderNumber ? (
            <>
              {" "}
              Order number{" "}
              <span className="font-semibold text-gold">{orderNumber}</span>
            </>
          ) : null}
          . You can track it from your account.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/account/orders"
            className="rounded-full bg-[#1c1712] px-8 py-4 text-sm font-semibold text-white hover:bg-gold"
          >
            View My Orders
          </Link>
          <Link
            href="/shop"
            className="rounded-full border border-[#1c1712] px-8 py-4 text-sm font-semibold text-[#1c1712] hover:bg-[#1c1712] hover:text-white"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#F7F3EC]">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#1c1712]/15 border-t-gold" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#F7F3EC] px-4 py-16">
        <div className="w-full max-w-md rounded-3xl border border-[#1c1712]/10 bg-white p-8 text-center shadow-xl">
          <p className="text-sm text-[#1c1712]/55">
            Please sign in to place your order.
          </p>
          <Link
            href="/sign-in?next=/checkout"
            className="mt-6 inline-block rounded-full bg-[#1c1712] px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-gold"
          >
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 bg-[#F7F3EC] px-6 text-center">
        <h1 className="font-display text-4xl font-medium text-[#1c1712]">
          Your cart is empty
        </h1>
        <Link
          href="/shop"
          className="rounded-full bg-[#1c1712] px-8 py-4 text-sm font-semibold text-white transition-colors hover:bg-gold"
        >
          Browse the collection
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F3EC] py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h1 className="font-display text-5xl font-medium text-[#1c1712]">
          Checkout
        </h1>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
          <form onSubmit={handlePlaceOrder} className="space-y-8">
            {/* Contact */}
            <section className="rounded-3xl border border-[#1c1712]/10 bg-white p-8">
              <h2 className="font-display text-xl font-medium text-[#1c1712]">
                Contact
              </h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <input
                  required
                  name="firstName"
                  placeholder="First name"
                  className="rounded-xl border border-[#1c1712]/15 px-4 py-3 text-sm focus:border-gold focus:outline-none"
                />
                <input
                  required
                  name="lastName"
                  placeholder="Last name"
                  className="rounded-xl border border-[#1c1712]/15 px-4 py-3 text-sm focus:border-gold focus:outline-none"
                />
                <input
                  required
                  name="email"
                  type="email"
                  defaultValue={user.email}
                  placeholder="Email"
                  className="rounded-xl border border-[#1c1712]/15 px-4 py-3 text-sm focus:border-gold focus:outline-none sm:col-span-2"
                />
                <input
                  required
                  name="phone"
                  type="tel"
                  placeholder="Phone"
                  className="rounded-xl border border-[#1c1712]/15 px-4 py-3 text-sm focus:border-gold focus:outline-none sm:col-span-2"
                />
              </div>
            </section>

            {/* Address */}
            <section className="rounded-3xl border border-[#1c1712]/10 bg-white p-8">
              <h2 className="font-display text-xl font-medium text-[#1c1712]">
                Delivery Address
              </h2>
              <div className="mt-5 grid gap-4">
                <input
                  required
                  name="street"
                  placeholder="Street address"
                  className="rounded-xl border border-[#1c1712]/15 px-4 py-3 text-sm focus:border-gold focus:outline-none"
                />
                <div className="grid gap-4 sm:grid-cols-3">
                  <input
                    required
                    name="city"
                    placeholder="City"
                    className="rounded-xl border border-[#1c1712]/15 px-4 py-3 text-sm focus:border-gold focus:outline-none"
                  />
                  <input
                    required
                    name="state"
                    placeholder="State"
                    className="rounded-xl border border-[#1c1712]/15 px-4 py-3 text-sm focus:border-gold focus:outline-none"
                  />
                  <input
                    required
                    name="pincode"
                    inputMode="numeric"
                    pattern="[0-9]{5,6}"
                    title="Enter a valid 5 or 6 digit PIN code"
                    placeholder="PIN code"
                    className="rounded-xl border border-[#1c1712]/15 px-4 py-3 text-sm focus:border-gold focus:outline-none"
                  />
                </div>
              </div>
            </section>

            {/* Payment */}
            <section className="rounded-3xl border border-[#1c1712]/10 bg-white p-8">
              <h2 className="flex items-center gap-2 font-display text-xl font-medium text-[#1c1712]">
                <CreditCard size={18} className="text-gold" /> Payment
              </h2>
              <div className="mt-5 rounded-xl border-2 border-dashed border-[#1c1712]/15 p-6 text-center">
                <Lock size={20} className="mx-auto text-gold" />
                <p className="mt-2 text-sm font-medium text-[#1c1712]">
                  Cash on Delivery / Pay on delivery
                </p>
                <p className="mt-1 text-xs text-[#1c1712]/45">
                  Your order will be confirmed and payment collected on delivery.
                </p>
              </div>
            </section>

            {error ? (
              <p
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
              >
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#1c1712] py-4 text-sm font-semibold text-white transition-colors hover:bg-gold disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Placing order…
                </>
              ) : (
                `Place Order — ${formatPrice(total)}`
              )}
            </button>
          </form>

          {/* Summary */}
          <div className="h-fit rounded-3xl border border-[#1c1712]/10 bg-white p-8 lg:sticky lg:top-24">
            <h2 className="font-display text-2xl font-medium text-[#1c1712]">
              Order Summary
            </h2>

            <ul className="mt-6 space-y-4">
              {items.map(({ product, quantity }) => (
                <li key={product.id} className="flex justify-between gap-4">
                  <span className="text-sm text-[#1c1712]/70">
                    {product.name}{" "}
                    <span className="text-[#1c1712]/40">× {quantity}</span>
                  </span>
                  <span className="text-sm font-medium text-[#1c1712]">
                    {formatPrice(
                      (product.salePrice ?? product.price) * quantity,
                    )}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-6 space-y-2 border-t border-[#1c1712]/10 pt-4 text-sm">
              <div className="flex justify-between text-[#1c1712]/60">
                <span>Subtotal</span>
                <span className="text-[#1c1712]">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#1c1712]/60">
                <span>Shipping</span>
                <span className="text-[#1c1712]">
                  {shipping === 0 ? "Free" : formatPrice(shipping)}
                </span>
              </div>
              <div className="flex justify-between border-t border-[#1c1712]/10 pt-4 text-base font-semibold text-[#1c1712]">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
