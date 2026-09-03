"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { m as motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingBag, Star, X } from "lucide-react";
import type { Product } from "@/lib/data/products";
import ImageNavArrow from "@/components/product/ImageNavArrow";
import { useWishlist } from "@/lib/store/wishlist-context";
import { useCart } from "@/lib/store/cart-context";
import { cn, formatPrice } from "@/lib/utils";
import { toast } from "sonner";

export default function QuickViewModal({
  product,
  open,
  onClose,
}: {
  product: Product;
  open: boolean;
  onClose: () => void;
}) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [imgIndex, setImgIndex] = useState(0);
  const wished = isWishlisted(product.id);

  if (!product) return null;

  const images = product.gallery.length ? product.gallery : [product.image];
  const hasMultiple = images.length > 1;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl overflow-hidden rounded-3xl bg-[#F8FCFE]"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow"
              aria-label="Close quick view"
            >
              <X size={18} />
            </button>

            <div className="grid md:grid-cols-2">
              <div className="relative h-72 bg-[#EFF8FC] md:h-full">
                <AnimatePresence initial={false}>
                  <motion.div
                    key={imgIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={images[imgIndex]}
                      alt={product.name}
                      fill
                      sizes="400px"
                      className="object-contain p-8"
                    />
                  </motion.div>
                </AnimatePresence>

                {hasMultiple && (
                  <>
                    <ImageNavArrow
                      direction="left"
                      onClick={() =>
                        setImgIndex((i) => (i - 1 + images.length) % images.length)
                      }
                      ariaLabel="Previous image"
                    />
                    <ImageNavArrow
                      direction="right"
                      onClick={() => setImgIndex((i) => (i + 1) % images.length)}
                      ariaLabel="Next image"
                    />

                    <div className="pointer-events-none absolute inset-x-0 bottom-2 z-10 flex justify-center">
                      <div className="pointer-events-auto flex items-center gap-1.5 rounded-full bg-[#0f2838]/30 px-2 py-1 shadow-sm backdrop-blur-sm">
                        {images.map((_, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setImgIndex(i)}
                            aria-label={`View image ${i + 1}`}
                            className={cn(
                              "h-1 rounded-full transition-all duration-300",
                              i === imgIndex
                                ? "w-3.5 bg-gold shadow-[0_0_6px_rgba(201,169,110,0.8)]"
                                : "w-1 bg-white/65 hover:bg-gold/90",
                            )}
                          />
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="flex flex-col p-8">
                <p className="text-[10px] font-semibold tracking-[0.2em] text-gold uppercase">
                  {product.brand}
                </p>
                <h2 className="mt-2 font-display text-3xl font-semibold text-[#174A63]">
                  {product.name}
                </h2>

                <div className="mt-2 flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={
                          i < Math.round(product.rating)
                            ? "fill-gold text-gold"
                            : "text-[#174A63]/20"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-sm text-[#174A63]/50">
                    {product.rating} ({product.reviewCount} reviews)
                  </span>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <span className="text-2xl font-semibold text-[#174A63]">
                    {formatPrice(product.salePrice ?? product.price)}
                  </span>
                  {product.salePrice && (
                    <span className="text-lg text-[#174A63]/35 line-through">
                      {formatPrice(product.price)}
                    </span>
                  )}
                </div>

                <p className="mt-4 text-sm leading-relaxed text-[#174A63]/60">
                  {product.description}
                </p>

                <p className="mt-4 text-xs text-[#174A63]/40">
                  Volume: <span className="font-medium">{product.volume}</span>{" "}
                  • {product.gender} • {product.category}
                </p>

                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      addToCart(product);
                      toast.success(`${product.name} added to bag`);
                    }}
                    className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#174A63] py-3 text-sm font-medium text-white transition-colors hover:bg-gold"
                  >
                    <ShoppingBag size={16} />
                    Add to Bag
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleWishlist(product)}
                    aria-label="Toggle wishlist"
                    className={cn(
                      "flex h-11 w-11 items-center justify-center rounded-full border transition-colors",
                      wished
                        ? "border-red-200 bg-red-50 text-red-500"
                        : "border-[#174A63]/20 text-[#174A63]/50 hover:border-gold hover:text-gold",
                    )}
                  >
                    <Heart size={18} fill={wished ? "currentColor" : "none"} />
                  </button>
                </div>

                <Link
                  href={`/product/${product.slug}`}
                  onClick={onClose}
                  className="mt-3 text-center text-sm font-medium text-[#174A63]/60 underline-offset-4 hover:underline"
                >
                  View full details
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
