"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "@/lib/store/cart-context";
import { formatPrice } from "@/lib/utils";

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeFromCart, subtotal } =
    useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm"
            onClick={closeCart}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.35, ease: "easeInOut" }}
            className="fixed right-0 top-0 z-[90] flex h-full w-full max-w-md flex-col bg-[#F7F3EC] shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[#1c1712]/10 px-6 py-5">
              <h2 className="font-display text-2xl font-semibold text-[#1c1712]">
                Your Bag
              </h2>
              <button
                type="button"
                onClick={closeCart}
                className="rounded-full p-2 text-[#1c1712]/60 hover:bg-black/5"
                aria-label="Close cart"
              >
                <X size={22} />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#1c1712]/5">
                  <ShoppingBag size={30} className="text-[#1c1712]/40" />
                </div>
                <p className="text-lg font-medium text-[#1c1712]">
                  Your bag is empty
                </p>
                <p className="text-sm text-[#1c1712]/50">
                  Discover our hand-curated collection of rare attars.
                </p>
                <Link
                  href="/shop"
                  onClick={closeCart}
                  className="mt-2 rounded-full bg-[#1c1712] px-6 py-3 text-sm font-medium text-white"
                >
                  Shop Attars
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-6">
                  <ul className="space-y-6">
                    {items.map(({ product, quantity }) => (
                      <li
                        key={product.id}
                        className="flex gap-4 border-b border-[#1c1712]/10 pb-6"
                      >
                        <Link
                          href={`/product/${product.slug}`}
                          onClick={closeCart}
                          className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-white"
                        >
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            sizes="80px"
                            className="object-contain p-2"
                          />
                        </Link>

                        <div className="flex flex-1 flex-col">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-medium text-[#1c1712]">
                                {product.name}
                              </p>
                              <p className="text-xs text-[#1c1712]/50">
                                {product.volume}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFromCart(product.id)}
                              className="text-[#1c1712]/40 hover:text-red-600"
                              aria-label="Remove item"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>

                          <div className="mt-auto flex items-center justify-between pt-3">
                            <div className="flex items-center gap-3 rounded-full border border-[#1c1712]/15 px-3 py-1">
                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(product.id, quantity - 1)
                                }
                                className="text-[#1c1712]/60"
                                aria-label="Decrease quantity"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="w-5 text-center text-sm font-medium text-[#1c1712]">
                                {quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(product.id, quantity + 1)
                                }
                                className="text-[#1c1712]/60"
                                aria-label="Increase quantity"
                              >
                                <Plus size={14} />
                              </button>
                            </div>

                            <p className="font-semibold text-[#1c1712]">
                              {formatPrice(
                                (product.salePrice ?? product.price) *
                                  quantity,
                              )}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-[#1c1712]/10 px-6 py-6">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm text-[#1c1712]/60">Subtotal</span>
                    <span className="font-semibold text-[#1c1712]">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  <p className="mb-5 text-xs text-[#1c1712]/40">
                    Shipping and taxes calculated at checkout.
                  </p>
                  <Link
                    href="/checkout"
                    onClick={closeCart}
                    className="block rounded-full bg-[#1c1712] py-4 text-center font-medium text-white transition-colors hover:bg-[#1c1712]/90"
                  >
                    Checkout — {formatPrice(subtotal)}
                  </Link>
                  <button
                    type="button"
                    onClick={closeCart}
                    className="mt-3 w-full rounded-full border border-[#1c1712]/20 py-3 text-sm font-medium text-[#1c1712]/70"
                  >
                    Continue Shopping
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
