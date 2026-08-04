"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CreditCard, Lock } from "lucide-react";
import { useCart } from "@/lib/store/cart-context";
import { formatPrice } from "@/lib/utils";

export default function CheckoutPage() {
  const { items, subtotal } = useCart();
  const [placed, setPlaced] = useState(false);

  const shipping = subtotal >= 1500 ? 0 : 99;
  const total = subtotal + shipping;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setPlaced(true);
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
          Your order has been placed successfully. A confirmation email with
          tracking details is on its way. Payment integration (Razorpay /
          Stripe) will be connected soon.
        </p>
        <div className="flex gap-4">
          <Link
            href="/shop"
            className="rounded-full bg-[#1c1712] px-8 py-4 text-sm font-semibold text-white hover:bg-gold"
          >
            Continue Shopping
          </Link>
          <Link
            href="/account"
            className="rounded-full border border-[#1c1712] px-8 py-4 text-sm font-semibold text-[#1c1712] hover:bg-[#1c1712] hover:text-white"
          >
            Track Order
          </Link>
        </div>
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
                  placeholder="First name"
                  className="rounded-xl border border-[#1c1712]/15 px-4 py-3 text-sm focus:border-gold focus:outline-none"
                />
                <input
                  required
                  placeholder="Last name"
                  className="rounded-xl border border-[#1c1712]/15 px-4 py-3 text-sm focus:border-gold focus:outline-none"
                />
                <input
                  required
                  type="email"
                  placeholder="Email"
                  className="rounded-xl border border-[#1c1712]/15 px-4 py-3 text-sm focus:border-gold focus:outline-none sm:col-span-2"
                />
                <input
                  required
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
                  placeholder="Street address"
                  className="rounded-xl border border-[#1c1712]/15 px-4 py-3 text-sm focus:border-gold focus:outline-none"
                />
                <div className="grid gap-4 sm:grid-cols-3">
                  <input
                    required
                    placeholder="City"
                    className="rounded-xl border border-[#1c1712]/15 px-4 py-3 text-sm focus:border-gold focus:outline-none"
                  />
                  <input
                    required
                    placeholder="State"
                    className="rounded-xl border border-[#1c1712]/15 px-4 py-3 text-sm focus:border-gold focus:outline-none"
                  />
                  <input
                    required
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
                  Razorpay / Stripe integration
                </p>
                <p className="mt-1 text-xs text-[#1c1712]/45">
                  Secure payments will be enabled in the next milestone.
                </p>
              </div>
            </section>

            <button
              type="submit"
              className="w-full rounded-full bg-[#1c1712] py-4 text-sm font-semibold text-white transition-colors hover:bg-gold"
            >
              Place Order — {formatPrice(total)}
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
