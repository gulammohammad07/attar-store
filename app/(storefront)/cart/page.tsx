"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { m as motion } from "framer-motion";
import { ArrowRight, Minus, Plus, ShieldCheck, Trash2 } from "lucide-react";
import { useCart } from "@/lib/store/cart-context";
import { getPublicStoreSettings } from "@/lib/actions/settings.actions";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, subtotal, clearCart } =
    useCart();
  const [settings, setSettings] = useState({
    freeShippingThreshold: 1500,
    shippingFee: 99,
  });

  useEffect(() => {
    let active = true;
    getPublicStoreSettings().then((storeSettings) => {
      if (active) {
        setSettings({
          freeShippingThreshold: storeSettings.freeShippingThreshold,
          shippingFee: storeSettings.shippingFee,
        });
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const shipping =
    subtotal >= settings.freeShippingThreshold || subtotal === 0
      ? 0
      : settings.shippingFee;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 bg-[#F8FCFE] px-6 text-center">
        <h1 className="font-display text-5xl font-medium text-[#174A63]">
          Your Bag is Empty
        </h1>
        <p className="max-w-sm text-sm text-[#174A63]/50">
          Your future signature scent is waiting. Explore the collection and
          find it.
        </p>
        <Link
          href="/shop"
          className="rounded-full bg-[#174A63] px-8 py-4 text-sm font-semibold text-white transition-colors hover:bg-gold"
        >
          Shop Attars
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FCFE] py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-4xl font-medium text-[#174A63] sm:text-5xl">
            Shopping Bag
          </h1>
          <button
            type="button"
            onClick={clearCart}
            className="text-sm text-[#174A63]/50 underline-offset-4 hover:text-red-600 hover:underline"
          >
            Clear bag
          </button>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
          {/* Items */}
          <div className="space-y-6">
            {items.map(({ product, quantity, size }, index) => (
              <motion.div
                key={`${product.id}-${size ?? "default"}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                className="flex flex-col gap-6 rounded-3xl border border-[#174A63]/10 bg-white p-6 sm:flex-row sm:items-center"
              >
                <Link
                  href={`/product/${product.slug}`}
                  className="relative h-36 w-full shrink-0 overflow-hidden rounded-2xl bg-[#EFF8FC] sm:w-32"
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="128px"
                    quality={75}
                    className="object-contain p-4"
                  />
                </Link>

                <div className="flex flex-1 flex-col sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                  <div>
                    <p className="text-[10px] font-semibold tracking-[0.2em] text-gold uppercase">
                      {product.brand}
                    </p>
                    <Link
                      href={`/product/${product.slug}`}
                      className="mt-1 block font-display text-2xl font-medium text-[#174A63] hover:text-gold"
                    >
                      {product.name}
                    </Link>
                    <p className="mt-1 text-xs text-[#174A63]/45">
                      {product.volume} • {product.category} {size ? `• ${size}` : ""}
                    </p>

                    <button
                      type="button"
                      onClick={() => removeFromCart(product.id, size)}
                      className="mt-3 flex items-center gap-1.5 text-xs text-[#174A63]/45 hover:text-red-600"
                    >
                      <Trash2 size={14} />
                      Remove
                    </button>
                  </div>

                  <div className="flex items-center justify-between sm:flex-col sm:items-end sm:gap-4">
                    <div className="flex items-center gap-3 rounded-full border border-[#174A63]/15 px-4 py-2">
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, quantity - 1, size)}
                        className="text-[#174A63]/60"
                        aria-label="Decrease"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-6 text-center font-semibold text-[#174A63]">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, quantity + 1, size)}
                        className="text-[#174A63]/60"
                        aria-label="Increase"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <p className="text-lg font-semibold text-[#174A63]">
                      {formatPrice((product.salePrice ?? product.price) * quantity)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Summary */}
          <div className="h-fit rounded-3xl border border-[#174A63]/10 bg-white p-8 lg:sticky lg:top-24">
            <h2 className="font-display text-2xl font-medium text-[#174A63]">
              Order Summary
            </h2>

            <div className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between text-[#174A63]/60">
                <span>Subtotal</span>
                <span className="font-medium text-[#174A63]">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-[#174A63]/60">
                <span>Shipping</span>
                <span className="font-medium text-[#174A63]">
                  {shipping === 0 ? "Free" : formatPrice(shipping)}
                </span>
              </div>
              {shipping > 0 && (
                <p className="rounded-xl bg-[#E3F2F9] px-3 py-2 text-xs text-[#174A63]/60">
                  Add{" "}
                  {formatPrice(settings.freeShippingThreshold - subtotal)} more
                  for free shipping.
                </p>
              )}
              <div className="border-t border-[#174A63]/10 pt-4">
                <div className="flex justify-between text-base font-semibold text-[#174A63]">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            </div>

            <Link
              href="/checkout"
              className="mt-6 flex items-center justify-center gap-2 rounded-full bg-[#174A63] py-4 text-sm font-semibold text-white transition-colors hover:bg-gold"
            >
              Proceed to Checkout
              <ArrowRight size={16} />
            </Link>

            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[#174A63]/45">
              <ShieldCheck size={14} className="text-gold" />
              Secure 256-bit encrypted checkout
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
