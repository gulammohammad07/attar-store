"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { m as motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingBag, Star } from "lucide-react";
import type { Product } from "@/lib/data/products";
import ImageNavArrow from "@/components/product/ImageNavArrow";
import { useWishlist } from "@/lib/store/wishlist-context";
import { useCart } from "@/lib/store/cart-context";
import { cn, formatPrice } from "@/lib/utils";
import { toast } from "sonner";

export default function ProductCard({
  product,
  className,
  loading = "lazy",
  dark = false,
}: {
  product: Product;
  className?: string;
  loading?: "lazy" | "eager";
  dark?: boolean;
}) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [imgIndex, setImgIndex] = useState(0);

  const images = product.gallery.length ? product.gallery : [product.image];
  const hasMultiple = images.length > 1;

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImgIndex((i) => (i - 1 + images.length) % images.length);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImgIndex((i) => (i + 1) % images.length);
  };

  const wished = isWishlisted(product.id);
  const price = product.salePrice ?? product.price;
  const discount = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className={cn("group relative", className)}
      >
        <div className={cn(
          "relative overflow-hidden rounded-2xl bg-white shadow-[0_4px_20px_-6px_rgba(26,26,26,0.08)] ring-1 ring-[#ece7dc] transition-all duration-500 group-hover:shadow-[0_24px_50px_-16px_rgba(26,26,26,0.2)] group-hover:ring-[#b4532a]/30",
          dark && "border border-white/[0.06] bg-[#112d3d] ring-white/[0.06]"
        )}>
          {product.badge && (
            <span
              className={cn(
                "absolute left-4 top-4 z-10 rounded-full px-3.5 py-1.5 text-[10px] font-bold tracking-[0.14em] uppercase",
                product.badge === "Sale"
                  ? "bg-[#c0392b] text-white"
                  : product.badge === "Limited Edition"
                    ? "bg-[#1a1a1a] text-[#e2cc9c]"
                    : "bg-[#b4532a] text-white",
              )}
            >
              {product.badge}
            </span>
          )}

          {discount > 0 && product.badge !== "Sale" && (
            <span className={cn(
              "absolute bottom-3 left-3 z-10 rounded-full px-3 py-1 text-[10px] font-bold backdrop-blur",
              dark ? "bg-[#0a1b26]/80 text-red-400" : "bg-white/90 text-[#c0392b]"
            )}>
              -{discount}%
            </span>
          )}

          <button
            type="button"
            onClick={() => toggleWishlist(product)}
            aria-label="Add to wishlist"
            className={cn(
              "absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.08)] ring-1 transition-all hover:scale-110",
              dark
                ? "bg-[#0a1b26]/70 ring-white/10"
                : "bg-white ring-black/5",
              wished
                ? "text-[#e0432f]"
                : dark
                  ? "text-white/60 hover:text-red-400"
                  : "text-[#1a1a1a]/60 hover:text-[#e0432f]",
            )}
          >
            <Heart size={16} fill={wished ? "currentColor" : "none"} />
          </button>

          <div className={cn(
            "relative aspect-square w-full overflow-hidden sm:aspect-[4/5]",
            dark ? "bg-gradient-to-b from-[#122d3d] to-[#0a1b26]" : "bg-[#f3efe6]"
          )}>
            <Link
              href={`/product/${product.slug}`}
              className="block h-full w-full"
              onClick={(e) => e.stopPropagation()}
            >
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
                    loading={loading}
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                </motion.div>
              </AnimatePresence>
            </Link>

            {hasMultiple && (
              <>
                <ImageNavArrow
                  direction="left"
                  onClick={prevImage}
                  ariaLabel="Previous image"
                  variant={dark ? "dark" : "light"}
                  size={14}
                  className="h-7 w-7 opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:h-8 sm:w-8"
                />
                <ImageNavArrow
                  direction="right"
                  onClick={nextImage}
                  ariaLabel="Next image"
                  variant={dark ? "dark" : "light"}
                  size={14}
                  className="h-7 w-7 opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:h-8 sm:w-8"
                />

                <div className="pointer-events-none absolute inset-x-0 bottom-1.5 z-10 flex justify-center">
                  <div className="pointer-events-auto flex items-center gap-1 rounded-full bg-[#0f2838]/20 px-1.5 py-0.5 shadow-sm backdrop-blur-sm">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setImgIndex(i);
                        }}
                        aria-label={`View image ${i + 1}`}
                        aria-current={i === imgIndex}
                        className="group/dot flex h-3.5 w-3 items-center justify-center"
                      >
                        <span
                          className={cn(
                            "h-0.5 rounded-full transition-all duration-300",
                            i === imgIndex
                              ? "w-2.5 bg-gold/90"
                              : "w-0.5 bg-white/50 group-hover/dot:bg-gold/70",
                          )}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          <div className={cn("p-4 sm:p-5", dark && "border-t border-white/[0.06]")}>
            <div className="flex items-center justify-between">
              <p className={cn(
                "text-[11px] font-bold tracking-[0.18em] uppercase",
                dark ? "text-gold" : "text-[#b4532a]"
              )}>
                {product.brand}
              </p>
              <div className="flex items-center gap-1 text-xs">
                <Star size={12} className="fill-[#e08b3c] text-[#e08b3c]" />
                <span className={cn("font-semibold", dark ? "text-[#dceff7]/90" : "text-[#1a1a1a]")}>
                  {product.rating}
                </span>
                <span className={cn(dark ? "text-[#dceff7]/30" : "text-[#a3a099]")}>
                  ({product.reviewCount})
                </span>
              </div>
            </div>

            <Link href={`/product/${product.slug}`} className="mt-1.5 block">
              <h3 className={cn(
                "font-display text-xl font-semibold transition-colors group-hover:text-[#b4532a]",
                dark ? "text-[#f8fcfe]" : "text-[#1a1a1a]"
              )}>
                {product.name}
              </h3>
            </Link>

            <p className={cn("mt-1 text-xs", dark ? "text-[#dceff7]/35" : "text-[#a3a099]")}>
              {product.volume} • {product.category}
            </p>

            <div className="mt-3 flex items-center gap-2">
              <span className={cn("text-lg font-bold", dark ? "text-[#f8fcfe]" : "text-[#1a1a1a]")}>
                {formatPrice(price)}
              </span>
              {product.salePrice && (
                <span className={cn("text-sm line-through", dark ? "text-[#dceff7]/25" : "text-[#a3a099]")}>
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                addToCart(product);
                toast.success(`${product.name} added to bag`);
              }}
              className={cn(
                "mt-4 flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-xs font-bold tracking-[0.14em] uppercase transition-all duration-300 active:scale-[0.98]",
                dark
                  ? "bg-[#f8fcfe] text-[#0a1b26] hover:bg-[#b4532a] hover:text-white"
                  : "bg-[#1a1a1a] text-white hover:bg-[#b4532a]",
              )}
            >
              <ShoppingBag size={15} />
              Add to Bag
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
